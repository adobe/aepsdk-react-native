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

    // Cache to store PropositionItem objects by their ID for unified tracking
    private var propositionItemCache = [String: PropositionItem]()
    // Cache to store the parent Proposition for each PropositionItem
    private var propositionCache = [String: Proposition]()

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
            
            // Cache PropositionItems for unified tracking when propositions are retrieved
            if let propositionsDict = propositions {
                let allPropositions = Array(propositionsDict.values).flatMap { $0 }
                self.cachePropositionsItems(allPropositions)
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

    /// MARK: - Unified PropositionItem Tracking Methods
    
    /**
     * Tracks interactions with a PropositionItem using the provided interaction and event type.
     * This method is used by the React Native PropositionItem.track() method.
     * 
     * - Parameters:
     *   - itemId: The unique identifier of the PropositionItem
     *   - interaction: A custom string value to be recorded in the interaction (optional)
     *   - eventType: The MessagingEdgeEventType numeric value
     *   - tokens: Array containing the sub-item tokens for recording interaction (optional)
     */
    @objc
    func trackPropositionItem(
        _ itemId: String,
        interaction: String?,
        eventType: Int,
        tokens: [String]?,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let edgeEventType = MessagingEdgeEventType(rawValue: eventType) else {
            reject("InvalidEventType", "Invalid eventType: \(eventType)", nil)
            return
        }
        
        guard let propositionItem = findPropositionItemById(itemId) else {
            print("Warning: PropositionItem not found for ID: \(itemId)")
            resolve(nil)
            return
        }
        
        // Call the appropriate track method based on provided parameters
        if let interaction = interaction, let tokens = tokens {
            // Track with interaction and tokens
            propositionItem.track(interaction, withEdgeEventType: edgeEventType, forTokens: tokens)
        } else if let interaction = interaction {
            // Track with interaction only
            propositionItem.track(interaction, withEdgeEventType: edgeEventType)
        } else {
            // Track with event type only
            propositionItem.track(withEdgeEventType: edgeEventType)
        }
        
        print("Successfully tracked PropositionItem: \(itemId) with eventType: \(edgeEventType)")
        resolve(nil)
    }
    
    /**
     * Generates XDM data for PropositionItem interactions.
     * This method is used by the React Native PropositionItem.generateInteractionXdm() method.
     * 
     * - Parameters:
     *   - itemId: The unique identifier of the PropositionItem
     *   - interaction: A custom string value to be recorded in the interaction (optional)
     *   - eventType: The MessagingEdgeEventType numeric value
     *   - tokens: Array containing the sub-item tokens for recording interaction (optional)
     *   - resolve: Promise resolver with XDM data for the proposition interaction
     *   - reject: Promise rejecter for errors
     */
    @objc
    func generatePropositionInteractionXdm(
        _ itemId: String,
        interaction: String?,
        eventType: Int,
        tokens: [String]?,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let edgeEventType = MessagingEdgeEventType(rawValue: eventType) else {
            reject("InvalidEventType", "Invalid eventType: \(eventType)", nil)
            return
        }
        
        guard let propositionItem = findPropositionItemById(itemId) else {
            reject("PropositionItemNotFound", "No PropositionItem found with ID: \(itemId)", nil)
            return
        }
        
        // Generate XDM data using the appropriate method
        var xdmData: [String: Any]?
        
        if let interaction = interaction, let tokens = tokens {
            xdmData = propositionItem.generateInteractionXdm(interaction, withEdgeEventType: edgeEventType, forTokens: tokens)
        } else if let interaction = interaction {
            xdmData = propositionItem.generateInteractionXdm(interaction, withEdgeEventType: edgeEventType)
        } else {
            xdmData = propositionItem.generateInteractionXdm(withEdgeEventType: edgeEventType)
        }
        
        if let xdmData = xdmData {
            resolve(xdmData)
            print("Successfully generated XDM data for PropositionItem: \(itemId)")
        } else {
            reject("XDMGenerationFailed", "Failed to generate XDM data for PropositionItem: \(itemId)", nil)
        }
    }
    
    /// MARK: - PropositionItem Cache Management
    
    /**
     * Caches a PropositionItem and its parent Proposition for later tracking.
     * This method should be called when PropositionItems are created from propositions.
     */
    private func cachePropositionItem(_ propositionItem: PropositionItem, parentProposition: Proposition) {
        let itemId = propositionItem.itemId
        
        // Cache the PropositionItem
        propositionItemCache[itemId] = propositionItem
        
        // Cache the parent Proposition
        propositionCache[itemId] = parentProposition
        
        print("Cached PropositionItem with ID: \(itemId)")
    }
    
    /**
     * Caches multiple PropositionItems from a list of propositions.
     * This is a convenience method for caching all items from multiple propositions.
     */
    private func cachePropositionsItems(_ propositions: [Proposition]) {
        for proposition in propositions {
            for item in proposition.items {
                cachePropositionItem(item, parentProposition: proposition)
            }
        }
    }
    
    /**
     * Finds a cached PropositionItem by its ID.
     */
    private func findPropositionItemById(_ itemId: String) -> PropositionItem? {
        return propositionItemCache[itemId]
    }
    
    /**
     * Finds a cached parent Proposition by PropositionItem ID.
     */
    private func findPropositionByItemId(_ itemId: String) -> Proposition? {
        return propositionCache[itemId]
    }
    
    /**
     * Clears the PropositionItem cache.
     * This should be called when propositions are refreshed or when memory cleanup is needed.
     */
    @objc
    func clearPropositionItemCache(
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        propositionItemCache.removeAll()
        propositionCache.removeAll()
        print("PropositionItem cache cleared")
        resolve(nil)
    }
    
    /**
     * Gets the current size of the PropositionItem cache.
     * Useful for debugging and monitoring.
     */
    @objc
    func getPropositionItemCacheSize(
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        resolve(propositionItemCache.count)
    }
    
    /**
     * Checks if a PropositionItem exists in the cache.
     */
    @objc
    func hasPropositionItem(
        _ itemId: String,
        withResolver resolve: @escaping RCTPromiseResolveBlock,
        withRejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        resolve(propositionItemCache.keys.contains(itemId))
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
}
