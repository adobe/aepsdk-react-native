/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import Foundation
import ActivityKit
import AEPMessagingLiveActivity
import React

@objc(LiveActivityBridge)
class LiveActivityBridge: NSObject {
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    // MARK: - Start Live Activity with Push Token
    
    @objc
    func startAirplaneActivity(_ liveActivityID: String,
                               departureAirport: String,
                               arrivalAirport: String,
                               arrivalTerminal: String,
                               resolver: @escaping RCTPromiseResolveBlock,
                               rejecter: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            guard ActivityAuthorizationInfo().areActivitiesEnabled else {
                rejecter("ERROR", "Live Activities are disabled on this device", nil as NSError?)
                return
            }
            
            let trimmedID = liveActivityID.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmedID.isEmpty else {
                rejecter("ERROR", "Live Activity ID cannot be empty", nil as NSError?)
                return
            }
            
            let attributes = AirplaneTrackingAttributes(
                liveActivityData: LiveActivityData(liveActivityID: trimmedID),
                arrivalAirport: arrivalAirport,
                departureAirport: departureAirport,
                arrivalTerminal: arrivalTerminal
            )
            let initialContentState = AirplaneTrackingAttributes.ContentState(journeyProgress: 0)
            
            do {
                let newActivity = try Activity<AirplaneTrackingAttributes>.request(
                    attributes: attributes,
                    contentState: initialContentState,
                    pushType: .token
                )
                
                print("AirplaneTracking Live Activity requested. ID: \(newActivity.id)")
                
                // Get push token
                let pushToken = newActivity.pushToken
                    .map { $0.map { String(format: "%02x", $0) }.joined() } ?? ""
                
                resolver([
                    "activityId": newActivity.id,
                    "pushToken": pushToken
                ])
            } catch {
                rejecter("ERROR", "Error requesting live activity: \(error.localizedDescription)", error)
            }
        } else {
            rejecter("ERROR", "Live Activities require iOS 16.1 or later", nil as NSError?)
        }
    }
    
    // MARK: - Start Live Activity with Channel (iOS 18+)
    
    @objc
    func startAirplaneActivityWithChannel(_ channelID: String,
                                          departureAirport: String,
                                          arrivalAirport: String,
                                          arrivalTerminal: String,
                                          resolver: @escaping RCTPromiseResolveBlock,
                                          rejecter: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 18.0, *) {
            guard ActivityAuthorizationInfo().areActivitiesEnabled else {
                rejecter("ERROR", "Live Activities are disabled on this device", nil as NSError?)
                return
            }
            
            let trimmedChannelID = channelID.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmedChannelID.isEmpty else {
                rejecter("ERROR", "Channel ID cannot be empty", nil as NSError?)
                return
            }
            
            let attributes = AirplaneTrackingAttributes(
                liveActivityData: LiveActivityData(channelID: trimmedChannelID),
                arrivalAirport: arrivalAirport,
                departureAirport: departureAirport,
                arrivalTerminal: arrivalTerminal
            )
            let initialContentState = AirplaneTrackingAttributes.ContentState(journeyProgress: 0)
            
            do {
                let newActivity = try Activity<AirplaneTrackingAttributes>.request(
                    attributes: attributes,
                    contentState: initialContentState,
                    pushType: .channel(trimmedChannelID)
                )
                
                print("AirplaneTracking Live Activity (CHANNEL: \(trimmedChannelID)) requested. ID: \(newActivity.id)")
                
                resolver([
                    "activityId": newActivity.id,
                    "channelId": trimmedChannelID
                ])
            } catch {
                rejecter("ERROR", "Error requesting live activity: \(error.localizedDescription)", error)
            }
        } else {
            rejecter("ERROR", "Channel-based Live Activities require iOS 18.0 or later", nil as NSError?)
        }
    }
    
    // MARK: - Update Activity Progress
    
    @objc
    func updateActivityProgress(_ activityId: String,
                                progress: Int,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            let activities = Activity<AirplaneTrackingAttributes>.activities
            
            guard let activity = activities.first(where: { $0.id == activityId }) else {
                rejecter("ERROR", "Activity not found with ID: \(activityId)", nil as NSError?)
                return
            }
            
            Task {
                let updatedState = AirplaneTrackingAttributes.ContentState(journeyProgress: progress)
                await activity.update(using: updatedState)
                print("Updated \(activity.id) with progress: \(progress)%")
                resolver(["success": true, "activityId": activityId, "progress": progress])
            }
        } else {
            rejecter("ERROR", "Live Activities require iOS 16.1 or later", nil as NSError?)
        }
    }
    
    // MARK: - End Activity
    
    @objc
    func endActivity(_ activityId: String,
                     immediate: Bool,
                     resolver: @escaping RCTPromiseResolveBlock,
                     rejecter: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            let activities = Activity<AirplaneTrackingAttributes>.activities
            
            guard let activity = activities.first(where: { $0.id == activityId }) else {
                rejecter("ERROR", "Activity not found with ID: \(activityId)", nil as NSError?)
                return
            }
            
            Task {
                if immediate {
                    await activity.end(dismissalPolicy: .immediate)
                } else {
                    await activity.end(dismissalPolicy: .default)
                }
                
                print("Live Activity ended: \(activity.id)")
                resolver(["success": true, "activityId": activityId])
            }
        } else {
            rejecter("ERROR", "Live Activities require iOS 16.1 or later", nil as NSError?)
        }
    }
    
    // MARK: - End All Activities
    
    @objc
    func endAllActivities(_ resolver: @escaping RCTPromiseResolveBlock,
                          rejecter: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            let activities = Activity<AirplaneTrackingAttributes>.activities
            let count = activities.count
            
            Task {
                for activity in activities {
                    await activity.end(dismissalPolicy: .immediate)
                }
                print("Ended all \(count) Live Activities")
                resolver(["success": true, "endedCount": count])
            }
        } else {
            rejecter("ERROR", "Live Activities require iOS 16.1 or later", nil as NSError?)
        }
    }
    
    // MARK: - Get Running Activities
    
    @objc
    func getRunningActivities(_ resolver: @escaping RCTPromiseResolveBlock,
                              rejecter: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            // Only return ACTIVE activities (filter out ended/dismissed ones)
            let activities = Activity<AirplaneTrackingAttributes>.activities.filter {
                $0.activityState == .active
            }
            
            let activitiesData = activities.map { activity -> [String: Any] in
                let pushToken = activity.pushToken
                    .map { $0.map { String(format: "%02x", $0) }.joined() } ?? ""
                
                return [
                    "activityId": activity.id,
                    "pushToken": pushToken,
                    "departureAirport": activity.attributes.departureAirport,
                    "arrivalAirport": activity.attributes.arrivalAirport,
                    "arrivalTerminal": activity.attributes.arrivalTerminal,
                    "journeyProgress": activity.contentState.journeyProgress
                ]
            }
            
            resolver(activitiesData)
        } else {
            rejecter("ERROR", "Live Activities require iOS 16.1 or later", nil as NSError?)
        }
    }
    
    // MARK: - Check if Live Activities are enabled
    
    @objc
    func areActivitiesEnabled(_ resolver: @escaping RCTPromiseResolveBlock,
                              rejecter: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            let enabled = ActivityAuthorizationInfo().areActivitiesEnabled
            resolver(enabled)
        } else {
            resolver(false)
        }
    }
}
