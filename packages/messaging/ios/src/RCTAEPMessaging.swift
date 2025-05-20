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
        Messaging.getPropositionsForSurfaces(surfacePaths) { propositions, error in
            guard error == nil else {
                reject("Unable to Retrieve Propositions", nil, nil)
                return
            }
            if (propositions != nil && propositions!.isEmpty) {
                resolve([String: Any]());
                return;
            }
            resolve(RCTAEPMessagingDataBridge.transformPropositionDict(dict: propositions!))
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

    @objc(trackPropositionInteraction:itemId:eventType:interaction:tokens:)
    func trackPropositionInteraction(propositionData: [String: Any]?, itemId: String?, eventTypeIntFromJS: Int, interaction: String?, tokensArray: [String]?) {
        guard let propositionData = propositionData, let itemId = itemId, !itemId.isEmpty else {
            Log.debug(label:Self.EXTENSION_NAME, "trackPropositionInteraction - Proposition data or item ID is nil/empty. Cannot track interaction.")
            return
        }

        // 1. Map JS eventTypeInt to native Swift MessagingEdgeEventType
        var nativeEventType: MessagingEdgeEventType?
        switch eventTypeIntFromJS {
            case 0: // Corresponds to JS MessagingEdgeEventType.DISMISS
                nativeEventType = .dismiss
            case 1: // Corresponds to JS MessagingEdgeEventType.INTERACT
                nativeEventType = .interact
            case 3: // Corresponds to JS MessagingEdgeEventType.DISPLAY
                nativeEventType = .display
            // Note: Add other cases if new tracking methods are added in JS that use other event types from MessagingEdgeEventType.ts
            default:
                Log.debug(label:Self.EXTENSION_NAME, "trackPropositionInteraction - Unsupported event type integer from JS: \(eventTypeIntFromJS).")
                return
        }

        guard let eventType = nativeEventType else {
             // This case should ideally not be hit if the switch is exhaustive for supported JS values
            Log.debug(label:Self.EXTENSION_NAME, "trackPropositionInteraction - Native event type could not be determined.")
            return
        }

        // 2. Decode Proposition
        var nativeProposition: Proposition?
        do {
            // Convert the [String: Any] dictionary to JSON Data
            let jsonData = try JSONSerialization.data(withJSONObject: propositionData, options: [])
            // Decode the JSON Data into a Proposition object
            nativeProposition = try JSONDecoder().decode(Proposition.self, from: jsonData)
        } catch {
            Log.debug(label:Self.EXTENSION_NAME, "trackPropositionInteraction - Failed to decode Proposition from event data: \(error.localizedDescription)")
            return
        }

        guard let unwrappedProposition = nativeProposition else {
            Log.debug(label:Self.EXTENSION_NAME, "trackPropositionInteraction - Reconstructed native Proposition is nil.")
            return
        }

        // 3. Find Target Item
        var targetItem: PropositionItem? = nil
        for item in unwrappedProposition.items { // Accesses the lazy var 'items' which sets up parent proposition reference
            if item.itemId == itemId { // Assuming PropositionItem has 'itemId'
                targetItem = item
                break
            }
        }

        guard let foundItem = targetItem else {
            Log.debug(label:Self.EXTENSION_NAME, "trackPropositionInteraction - Could not find PropositionItem with id: \(itemId) in the reconstructed proposition.")
            return
        }
        
        // 4. Call Track
        foundItem.track(interaction, withEdgeEventType: eventType, forTokens: tokensArray)
        Log.debug(label:Self.EXTENSION_NAME, "trackPropositionInteraction - Successfully tracked interaction for item ID: \(itemId), EventType: \(eventType.toString())")
    }
}
