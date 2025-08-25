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
        let fullscreenMessage = message as? FullscreenMessage
        let parentMessage = fullscreenMessage?.parent
        
        // If parent message exists, emit it
        if let parentMessage = parentMessage {
            emitNativeEvent(
                name: Constants.SHOULD_SHOW_MESSAGE_EVENT,
                body: RCTAEPMessagingDataBridge.transformToMessage(message: parentMessage)
            )
        } else if let fullscreenMessage = fullscreenMessage {
            // Parent is nil but fullscreen message exists - emit empty body for now
            emitNativeEvent(
                name: Constants.SHOULD_SHOW_MESSAGE_EVENT,
                body: [:]
            )
        } else {
            // Both are nil, don't emit anything and return false
            return false
        }
        
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
