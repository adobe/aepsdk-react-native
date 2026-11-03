/*
    Copyright 2026 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law
    or agreed to in writing, software distributed under the License is
    distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF
    ANY KIND, either express or implied. See the License for the specific
    language governing permissions and limitations under the License.
*/

import AEPCore
import AEPMessaging
import AEPServices
import Foundation
import UIKit
import WebKit

/// Plain-Swift implementation behind the Obj-C++ TurboModule (`RCTAEPMessaging`).
/// It has no React Native dependency: promises are completed by the Obj-C++ layer, and native -> JS
/// events are reported through `eventEmitter`, which the Obj-C++ layer maps to the codegen emitters.
@objc(RCTAEPMessagingImpl)
public class RCTAEPMessagingImpl: NSObject, MessagingDelegate {
    private var messageCache = [String: Message]()
    private var jsHandlerMessageCache = [String: Message]()
    private var latestMessage: Message? = nil
    private let semaphore = DispatchSemaphore(value: 0)
    private var shouldSaveMessage = false
    private var shouldShowMessage = true
    // Map uuid (scopeDetails.activity.id) -> parent Proposition
    private var propositionByUuid = [String: Proposition]()

    /// Set by the TurboModule to forward native -> JS events (event name, payload).
    @objc public var eventEmitter: ((String, [String: Any]) -> Void)?

    @objc public func extensionVersion() -> String {
        return Messaging.extensionVersion
    }

    @objc public func getCachedMessages() -> [[String: Any]] {
        return messageCache.values.map {
            RCTAEPMessagingDataBridge.transformToMessage(message: $0)
        }
    }

    @objc public func getLatestMessage() -> [String: Any]? {
        guard let message = latestMessage else { return nil }
        return RCTAEPMessagingDataBridge.transformToMessage(message: message)
    }

    /// completion(result, nil) on success; completion(nil, errorCode) on failure.
    @objc public func getPropositions(
        forSurfaces surfaces: [String],
        completion: @escaping ([String: Any]?, String?) -> Void
    ) {
        let surfacePaths = surfaces.map { $0.isEmpty ? Surface() : Surface(path: $0) }
        Messaging.getPropositionsForSurfaces(surfacePaths) { [weak self] propositions, error in
            guard let self = self else { return }
            guard error == nil else {
                completion(nil, "Unable to Retrieve Propositions")
                return
            }
            guard let propositions = propositions, !propositions.isEmpty else {
                completion([String: Any](), nil)
                return
            }

            // Populate uuid->Proposition map using scopeDetails.activity.id
            for (_, list) in propositions {
                for proposition in list {
                    if let pMap = proposition.asDictionary() {
                        if let key = RCTAEPMessagingDataBridge.extractActivityId(from: pMap) {
                            self.propositionByUuid[key] = proposition
                        }
                    }
                }
            }

            completion(RCTAEPMessagingDataBridge.transformPropositionDict(dict: propositions) as [String: Any], nil)
        }
    }

    @objc public func refreshInAppMessages() {
        Messaging.refreshInAppMessages()
    }

    @objc public func setMessageSettings(shouldShowMessage: Bool, shouldSaveMessage: Bool) {
        self.shouldShowMessage = shouldShowMessage
        self.shouldSaveMessage = shouldSaveMessage
        semaphore.signal()
    }

    @objc public func setMessagingDelegate() {
        MobileCore.messagingDelegate = self
    }

    /// completion(true) on success, completion(false) on failure.
    @objc public func updatePropositions(
        forSurfaces surfaces: [String],
        completion: @escaping (Bool) -> Void
    ) {
        let mapped = surfaces.map { Surface(path: $0) }
        Messaging.updatePropositionsForSurfaces(mapped) { [weak self] success in
            if success {
                self?.propositionByUuid.removeAll()
            }
            completion(success)
        }
    }

    // MARK: - Message class methods

    @objc public func clear(_ id: String) {
        if let msg = messageCache[id] {
            messageCache.removeValue(forKey: msg.id)
            print("clear: \(id) removed")
        } else {
            print("clear: \(id) not found")
        }
    }

    @objc public func dismiss(_ id: String, suppressAutoTrack: Bool) {
        if let msg = messageCache[id] {
            msg.dismiss(suppressAutoTrack: suppressAutoTrack)
            print("dismiss: \(id) to \(suppressAutoTrack)")
        } else {
            print("dismiss: \(id) not found")
        }
    }

    @objc public func setAutoTrack(_ id: String, autoTrack: Bool) {
        if let msg = messageCache[id] {
            msg.autoTrack = autoTrack
            print("setAutoTrack: \(id) to \(autoTrack)")
        } else {
            print("setAutoTrack: \(id) not found")
        }
    }

    @objc public func show(_ id: String) {
        if let msg = messageCache[id] {
            msg.show()
            print("show: \(id) shown")
        } else {
            print("show: \(id) not found")
        }
    }

    @objc public func track(_ id: String, interaction: String, eventType: Int) {
        let edgeEventType = MessagingEdgeEventType.init(rawValue: eventType) ?? MessagingEdgeEventType.dismiss
        if let msg = messageCache[id] {
            msg.track(interaction, withEdgeEventType: edgeEventType)
            print("track: \(id) to \(interaction) and \(edgeEventType)")
        } else {
            print("track: \(id) not found")
        }
    }

    @objc public func trackContentCardDisplay(
        _ propositionMap: [String: Any],
        contentCardMap: [String: Any]
    ) {
        guard let contentCardId = contentCardMap["id"] as? String else {
            print("Error: Content card ID is missing or invalid")
            return
        }

        do {
            let jsonData = try JSONSerialization.data(withJSONObject: propositionMap)
            let proposition = try JSONDecoder().decode(Proposition.self, from: jsonData)

            if let matchingItem = proposition.items.first(where: { $0.itemId == contentCardId }) {
                matchingItem.track(withEdgeEventType: MessagingEdgeEventType.display)
            } else {
                print("Error: No matching proposition item found for content card ID: \(contentCardId)")
            }
        } catch {
            print("Error decoding proposition: \(error.localizedDescription)")
        }
    }

    @objc public func trackContentCardInteraction(
        _ propositionMap: [String: Any],
        contentCardMap: [String: Any]
    ) {
        guard let contentCardId = contentCardMap["id"] as? String else {
            print("Error: Content card ID is missing or invalid")
            return
        }

        do {
            let jsonData = try JSONSerialization.data(withJSONObject: propositionMap)
            let proposition = try JSONDecoder().decode(Proposition.self, from: jsonData)

            if let matchingItem = proposition.items.first(where: { $0.itemId == contentCardId }) {
                matchingItem.track("click", withEdgeEventType: MessagingEdgeEventType.interact)
            } else {
                print("Error: No matching proposition item found for content card ID: \(contentCardId)")
            }
        } catch {
            print("Error decoding proposition: \(error.localizedDescription)")
        }
    }

    @objc public func handleJavascriptMessage(_ messageId: String, handlerName: String) {
        guard let message = jsHandlerMessageCache[messageId] else {
            print("[RCTAEPMessaging] handleJavascriptMessage: No message found in cache for messageId: \(messageId)")
            return
        }

        message.handleJavascriptMessage(handlerName) { [weak self] content in
            self?.emitNativeEvent(
                name: Constants.ON_JAVASCRIPT_MESSAGE_EVENT,
                body: [
                    Constants.MESSAGE_ID_KEY: messageId,
                    Constants.HANDLER_NAME_KEY: handlerName,
                    Constants.CONTENT_KEY: content ?? ""
                ]
            )
        }
    }

    @objc public func evaluateJavascript(_ messageId: String, javascriptString: String) {
        guard let message = jsHandlerMessageCache[messageId] else {
            print("[RCTAEPMessaging] evaluateJavascript: No message found in cache for messageId: \(messageId)")
            return
        }

        guard let messageWebView = message.view as? WKWebView else {
            print("[RCTAEPMessaging] evaluateJavascript: Could not get WKWebView from message")
            return
        }

        messageWebView.evaluateJavaScript(javascriptString) { [weak self] result, error in
            if let error = error {
                print("[RCTAEPMessaging] evaluateJavascript error: \(error)")
            }

            self?.emitNativeEvent(
                name: Constants.ON_JAVASCRIPT_RESULT_EVENT,
                body: [
                    Constants.MESSAGE_ID_KEY: messageId,
                    Constants.JAVASCRIPT_STRING_KEY: javascriptString,
                    Constants.RESULT_KEY: result ?? NSNull()
                ]
            )
        }
    }

    /// Tracks interactions with a PropositionItem using the provided interaction and event type.
    /// - Parameters:
    ///   - uuid: The UUID mapped to the PropositionItem (derived from activityId)
    ///   - interaction: A custom string value to be recorded in the interaction (optional)
    ///   - eventType: The MessagingEdgeEventType numeric value
    ///   - tokens: Array containing the sub-item tokens for recording interaction (optional)
    @objc public func trackPropositionItem(
        _ uuid: String,
        interaction: String?,
        eventType: Int,
        tokens: [String]?
    ) {
        NSLog("[MessagingBridge] trackPropositionItem called with eventType=\(eventType), uuid=\(uuid), interaction=\(String(describing: interaction)), tokens=\(String(describing: tokens))")

        guard !uuid.isEmpty else {
            NSLog("[MessagingBridge] Empty uuid provided; no-op.")
            return
        }

        guard let proposition = propositionByUuid[uuid] else {
            NSLog("[MessagingBridge] No cached proposition for uuid=\(uuid); no-op.")
            return
        }

        NSLog("[MessagingBridge] Found proposition for uuid=\(uuid). scope=\(proposition.scope), items=\(proposition.items.count)")

        // Event type mapping (Android parity)
        let edgeEventType = mapEdgeEventType(eventType) ?? .display

        // Track on the first item under this proposition
        guard let item = proposition.items.first else {
            NSLog("[MessagingBridge] Proposition for uuid=\(uuid) has no items; no-op.")
            return
        }

        NSLog("[MessagingBridge] Tracking (direct) uuid=\(uuid), interaction=\(String(describing: interaction)), tokens=\(String(describing: tokens)), eventType=\(edgeEventType.rawValue)")
        item.track(interaction, withEdgeEventType: edgeEventType, forTokens: tokens)

        NSLog("[MessagingBridge] Tracking complete for uuid=\(uuid)")
    }

    private static let inboxKeyPrefix = "aep_messaging_inbox_"

    @objc public func getInboxState(_ activityId: String) -> String? {
        guard !activityId.isEmpty else { return nil }
        let key = RCTAEPMessagingImpl.inboxKeyPrefix + activityId
        return UserDefaults.standard.string(forKey: key)
    }

    @objc public func setInboxState(_ activityId: String, stateJson: String) {
        guard !activityId.isEmpty else { return }
        let key = RCTAEPMessagingImpl.inboxKeyPrefix + activityId
        UserDefaults.standard.set(stateJson, forKey: key)
    }

    // MARK: - Messaging Delegate Methods

    public func onDismiss(message: Showable) {
        if let fullscreenMessage = message as? FullscreenMessage,
            let parentMessage = fullscreenMessage.parent
        {
            jsHandlerMessageCache.removeValue(forKey: parentMessage.id)
            emitNativeEvent(
                name: Constants.ON_DISMISS_EVENT,
                body: RCTAEPMessagingDataBridge.transformToMessage(message: parentMessage)
            )
        }
    }

    public func onShow(message: Showable) {
        if let fullscreenMessage = message as? FullscreenMessage,
            let message = fullscreenMessage.parent
        {
            jsHandlerMessageCache[message.id] = message
            emitNativeEvent(
                name: Constants.ON_SHOW_EVENT,
                body: RCTAEPMessagingDataBridge.transformToMessage(message: message)
            )
        }
    }

    public func shouldShowMessage(message: Showable) -> Bool {
        let fullscreenMessage = message as? FullscreenMessage
        let parentMessage = fullscreenMessage?.parent

        // If parent message exists, emit it
        if let parentMessage = parentMessage {
            emitNativeEvent(
                name: Constants.SHOULD_SHOW_MESSAGE_EVENT,
                body: RCTAEPMessagingDataBridge.transformToMessage(message: parentMessage)
            )
        } else if fullscreenMessage != nil {
            // Parent is nil but fullscreen message exists - emit empty body for now
            emitNativeEvent(name: Constants.SHOULD_SHOW_MESSAGE_EVENT, body: [:])
        } else {
            // Both are nil, don't emit anything and return false
            return false
        }

        // Blocks until JS answers through setMessageSettings.
        semaphore.wait()
        if let message = parentMessage {
            if self.shouldSaveMessage {
                self.messageCache[message.id] = message
            }

            if self.shouldShowMessage {
                latestMessage = message
            }
        }
        return self.shouldShowMessage
    }

    public func urlLoaded(_ url: URL, byMessage message: Showable) {
        if let fullscreenMessage = message as? FullscreenMessage,
            let parentMessage = fullscreenMessage.parent
        {
            emitNativeEvent(
                name: Constants.URL_LOADED_EVENT,
                body: [
                    "url": url.absoluteString,
                    "message": RCTAEPMessagingDataBridge.transformToMessage(message: parentMessage),
                ]
            )
        }
    }

    private func emitNativeEvent(name: String, body: [String: Any]) {
        eventEmitter?(name, body)
    }
}

// MARK: - Private helpers
private extension RCTAEPMessagingImpl {
    /// Maps JS MessagingEdgeEventType integer values to AEPMessaging.MessagingEdgeEventType cases
    /// JS enum values: DISMISS=0, INTERACT=1, TRIGGER=2, DISPLAY=3, PUSH_APPLICATION_OPENED=4, PUSH_CUSTOM_ACTION=5
    func mapEdgeEventType(_ value: Int) -> MessagingEdgeEventType? {
        switch value {
        case 0: return .dismiss
        case 1: return .interact
        case 2: return .trigger
        case 3: return .display
        case 4: return .pushApplicationOpened
        case 5: return .pushCustomAction
        default: return nil
        }
    }
}
