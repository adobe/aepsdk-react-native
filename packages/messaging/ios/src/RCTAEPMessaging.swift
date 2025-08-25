/*
    Copyright 2023 Adobe. All rights reserved.
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
import UserNotifications
import WebKit

@objc(RCTAEPMessaging)
public class RCTAEPMessaging: RCTEventEmitter, MessagingDelegate {
    private var messageCache = [String: Message]()
    private var latestMessage: Message? = nil
    private let semaphore = DispatchSemaphore(value: 0)
    private var shouldSaveMessage = false
    private var shouldShowMessage = true
    public static var emitter: RCTEventEmitter!


    override init() {
        super.init()
        RCTAEPMessaging.emitter = self
    }

    @objc override public static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc open override func supportedEvents() -> [String] {
        return Constants.SUPPORTED_EVENTS
    }

    @objc
    func extensionVersion(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock)
    {
        resolve(Messaging.extensionVersion)
    }

    @objc
    private func getCachedMessages(
        _ resolve: RCTPromiseResolveBlock,
        withRejecter reject: RCTPromiseRejectBlock
    ) {
        let cachedMessages = messageCache.values.map {
            RCTAEPMessagingDataBridge.transformToMessage(message: $0)
        }
        resolve(cachedMessages)
    }

    @objc
    func getLatestMessage(
        _ resolve: RCTPromiseResolveBlock,
        withRejecter reject: RCTPromiseRejectBlock
    ) {
        resolve(self.latestMessage != nil ? RCTAEPMessagingDataBridge.transformToMessage(message: self.latestMessage!) : nil)
    }
    
    @objc
    func getPropositionsForSurfaces(
        _ surfaces: [String],
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let surfacePaths = surfaces.map { $0.isEmpty ? Surface() : Surface(path: $0) }
        Messaging.getPropositionsForSurfaces(surfacePaths) { [weak self] propositions, error in
            guard let self = self else { return }
            guard error == nil else {
                reject("Unable to Retrieve Propositions", nil, nil)
                return
            }
            guard let propositions = propositions, !propositions.isEmpty else {
                resolve([String: Any]())
                return
            }

            // Populate uuid->Proposition map using scopeDetails.activity.activityID when available, else activity.id
            for (_, list) in propositions {
                for proposition in list {
                    if var pMap = proposition.asDictionary() {
                        var key: String? = nil
                        if let sd = pMap["scopeDetails"] as? [String: Any],
                           let act = sd["activity"] as? [String: Any] {
                            if let activityID = act["activityID"] as? String, !activityID.isEmpty {
                                key = activityID
                            } else if let id = act["id"] as? String, !id.isEmpty {
                                key = id
                            }
                        }
                        if key == nil {
                            key = self.extractActivityId(from: pMap)
                        }
                        if let key = key {
                            self.propositionByUuid[key] = proposition
                        }
                    }
                }
            }

            resolve(RCTAEPMessagingDataBridge.transformPropositionDict(dict: propositions))
        }
    }

    @objc
    func refreshInAppMessages() {
        Messaging.refreshInAppMessages()
    }

    @objc
    func setMessageSettings(
        _ shouldShowMessage: Bool,
        withShouldSaveMessage shouldSaveMessage: Bool
    ) {
        self.shouldShowMessage = shouldShowMessage
        self.shouldSaveMessage = shouldSaveMessage
        semaphore.signal()
    }

    @objc
    func setMessagingDelegate() {
        MobileCore.messagingDelegate = self
    }

    @objc
    func updatePropositionsForSurfaces(
        _ surfaces: [String],
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let mapped = surfaces.map { Surface(path: $0) }
        Messaging.updatePropositionsForSurfaces(mapped)
        propositionByUuid.removeAll()

        resolve(nil)
    }

    /// Message Class Methods
    @objc
    func clearMessage(
        _ id: String,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let msg = messageCache[id]
        if msg != nil {
            messageCache.removeValue(forKey: msg!.id)
            resolve(nil)
        }
        reject(Constants.CACHE_MISS, nil, nil)
    }

    @objc
    func dismissMessage(
        _ id: String,
        withSuppressAutoTrack suppressAutoTrack: Bool,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let msg = messageCache[id]
        if msg != nil {
            msg!.dismiss(suppressAutoTrack: suppressAutoTrack)
            resolve(nil)
            return
        }
        reject(Constants.CACHE_MISS, nil, nil)
    }

    @objc
    func setAutoTrack(
        _ id: String,
        withSuppressAutoTrack suppressAutoTrack: Bool,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {

        let msg = messageCache[id]
        if msg != nil {
            msg!.autoTrack = suppressAutoTrack
            resolve(nil)
            return
        }
        reject(Constants.CACHE_MISS, nil, nil)
    }

    @objc
    private func showMessage(
        _ id: String,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let msg = messageCache[id]
        if msg != nil {
            msg!.show()
            resolve(nil)
            return
        }
        reject(Constants.CACHE_MISS, nil, nil)

    }

    @objc
    func trackMessage(
        _ id: String,
        withInteraction interaction: String,
        withEventType eventType: Int,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {

        let msg = messageCache[id]
        let eventType =
            MessagingEdgeEventType.init(rawValue: eventType)
                ?? MessagingEdgeEventType.dismiss
        if msg != nil {
            msg!.track(interaction, withEdgeEventType: eventType)
            resolve(nil)
            return
        }
        reject(Constants.CACHE_MISS, nil, nil)
    }

    @objc
    func trackContentCardDisplay(
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

    @objc
    func trackContentCardInteraction(
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

    /// MARK: - Unified PropositionItem Tracking Methods
    
    /**
     * Tracks interactions with a PropositionItem using the provided interaction and event type.
     * This method is used by the React Native PropositionItem.track() method.
     * 
     * - Parameters:
     *   - uuid: The UUID mapped to the PropositionItem (derived from activityId)
     *   - interaction: A custom string value to be recorded in the interaction (optional)
     *   - eventType: The MessagingEdgeEventType numeric value
     *   - tokens: Array containing the sub-item tokens for recording interaction (optional)
     */

    @objc
    func trackPropositionItem(
        _ uuid: String,
        interaction: String?,
        eventType: Int,
        tokens: [String]?,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        NSLog("[MessagingBridge] trackPropositionItem called with eventType=\(eventType), uuid=\(uuid), interaction=\(String(describing: interaction)), tokens=\(String(describing: tokens))")

        guard !uuid.isEmpty else {
            NSLog("[MessagingBridge] Empty uuid provided; no-op.")
            resolve(nil)
            return
        }

        guard let proposition = propositionByUuid[uuid] else {
            NSLog("[MessagingBridge] No cached proposition for uuid=\(uuid); no-op.")
            resolve(nil)
            return
        }

        NSLog("[MessagingBridge] Found proposition for uuid=\(uuid). scope=\(proposition.scope), items=\(proposition.items.count)")

        // Event type mapping (Android parity)
        let edgeEventType = mapEdgeEventType(eventType) ?? .display

        // Track on the first item under this proposition
        guard let item = proposition.items.first else {
            NSLog("[MessagingBridge] Proposition for uuid=\(uuid) has no items; no-op.")
            resolve(nil)
            return
        }

        // Normalize inputs
        let trimmedInteraction = interaction?.trimmingCharacters(in: .whitespacesAndNewlines)
        let nonEmptyTokens = tokens?.compactMap { token in
            let t = token.trimmingCharacters(in: .whitespacesAndNewlines)
            return t.isEmpty ? nil : t
        }

        if let i = trimmedInteraction, !i.isEmpty {
            if let t = nonEmptyTokens, !t.isEmpty {
                NSLog("[MessagingBridge] Tracking with interaction and tokens. uuid=\(uuid), interaction=\(i), tokens=\(t), eventType=\(edgeEventType)")
                item.track(i, withEdgeEventType: edgeEventType, forTokens: t)
            } else {
                NSLog("[MessagingBridge] Tracking with interaction only. uuid=\(uuid), interaction=\(i), eventType=\(edgeEventType.rawValue)")
                item.track(i, withEdgeEventType: edgeEventType)
            }
        } else if let t = nonEmptyTokens, !t.isEmpty {
            NSLog("[MessagingBridge] Tracking with tokens only (no interaction). uuid=\(uuid), tokens=\(t), eventType=\(edgeEventType.rawValue)")
            item.track(withEdgeEventType: edgeEventType)
        } else {
            NSLog("[MessagingBridge] Tracking with event only. uuid=\(uuid), eventType=\(edgeEventType.rawValue)")
            item.track(withEdgeEventType: edgeEventType)
        }

        NSLog("[MessagingBridge] Tracking complete for uuid=\(uuid)")
        resolve(nil)
    }



    // Map uuid (scopeDetails.activity.id) -> parent Proposition
    private var propositionByUuid = [String: Proposition]()
   
    // Messaging Delegate Methods
    public func onDismiss(message: Showable) {
        if let fullscreenMessage = message as? FullscreenMessage,
            let parentMessage = fullscreenMessage.parent
        {
            emitNativeEvent(
                name: Constants.ON_DISMISS_EVENT,
                body: RCTAEPMessagingDataBridge.transformToMessage(
                    message: parentMessage
                )
            )
        }
    }

    public func onShow(message: Showable) {
        if let fullscreenMessage = message as? FullscreenMessage,
            let message = fullscreenMessage.parent
        {
            emitNativeEvent(
                name: Constants.ON_SHOW_EVENT,
                body: RCTAEPMessagingDataBridge.transformToMessage(message: message)
            )
        }
    }

    public func shouldShowMessage(message: Showable) -> Bool {
        if let fullscreenMessage = message as? FullscreenMessage,
            let message = fullscreenMessage.parent
        {
            emitNativeEvent(
                name: Constants.SHOULD_SHOW_MESSAGE_EVENT,
                body: RCTAEPMessagingDataBridge.transformToMessage(message: message)
            )
            semaphore.wait()
            if self.shouldSaveMessage {
                self.messageCache[message.id] = message
            }

            if self.shouldShowMessage {
                latestMessage = message
            }

            return self.shouldShowMessage
        }
        return false
    }

    public func urlLoaded(_ url: URL, byMessage message: Showable) {
        if let fullscreenMessage = message as? FullscreenMessage,
            let parentMessage = fullscreenMessage.parent
        {
            emitNativeEvent(
                name: Constants.URL_LOADED_EVENT,
                body: [
                    "url": url.absoluteString,
                    "message": RCTAEPMessagingDataBridge.transformToMessage(
                        message: parentMessage
                    ),
                ]
            )
        }
    }

    private func emitNativeEvent(name: String, body: Any) {
        RCTAEPMessaging.emitter.sendEvent(withName: name, body: body)
    }
}

// MARK: - Private helpers
private extension RCTAEPMessaging {
    /// Extracts activityId from a proposition dictionary at scopeDetails.activity.id
    func extractActivityId(from propositionDict: [String: Any]) -> String? {
        guard let scopeDetails = propositionDict["scopeDetails"] as? [String: Any],
              let activity = scopeDetails["activity"] as? [String: Any],
              let id = activity["id"] as? String else {
            return nil
        }
        return id
    }

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
