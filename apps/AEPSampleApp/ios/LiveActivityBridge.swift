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

@available(iOS 16.1, *)
extension ActivityState: @retroactive CustomStringConvertible {
    public var description: String {
        switch self {
        case .active: return "active"
        case .ended: return "ended"
        case .dismissed: return "dismissed"
        case .stale: return "stale"
        @unknown default: return "unknown"
        }
    }
}

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
            let allActivities = Activity<AirplaneTrackingAttributes>.activities
            NSLog("[LiveActivityBridge] endActivity called for ID: %@", activityId)
            NSLog("[LiveActivityBridge] Total activities count: %d", allActivities.count)
            
            for act in allActivities {
                NSLog("[LiveActivityBridge]   - %@ state=%@", act.id, act.activityState.description)
            }
            
            guard let activity = allActivities.first(where: { $0.id == activityId }) else {
                NSLog("[LiveActivityBridge] Activity NOT found with ID: %@", activityId)
                rejecter("ERROR", "Activity not found with ID: \(activityId)", nil as NSError?)
                return
            }
            
            NSLog("[LiveActivityBridge] Found activity %@, state before end: %@", activity.id, activity.activityState.description)
            
            Task {
                let dismissalPolicy: ActivityUIDismissalPolicy = immediate ? .immediate : .default
                
                if #available(iOS 16.2, *) {
                    let finalState = activity.contentState
                    await activity.end(using: finalState, dismissalPolicy: dismissalPolicy)
                } else {
                    await activity.end(dismissalPolicy: dismissalPolicy)
                }
                
                NSLog("[LiveActivityBridge] end() completed for %@", activity.id)
                NSLog("[LiveActivityBridge] State after end: %@", activity.activityState.description)
                
                // Log remaining activities
                let remaining = Activity<AirplaneTrackingAttributes>.activities
                NSLog("[LiveActivityBridge] Remaining activities: %d", remaining.count)
                for act in remaining {
                    NSLog("[LiveActivityBridge]   - %@ state=%@", act.id, act.activityState.description)
                }
                
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
            NSLog("[LiveActivityBridge] endAllActivities: found %d activities", count)
            
            Task {
                for activity in activities {
                    NSLog("[LiveActivityBridge]   ending %@ (state=%@)", activity.id, activity.activityState.description)
                    if #available(iOS 16.2, *) {
                        let finalState = activity.contentState
                        await activity.end(using: finalState, dismissalPolicy: .immediate)
                    } else {
                        await activity.end(dismissalPolicy: .immediate)
                    }
                }
                NSLog("[LiveActivityBridge] Ended all %d Live Activities", count)
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
            // Return ALL activities with their state
            let allActivities = Activity<AirplaneTrackingAttributes>.activities
            NSLog("[LiveActivityBridge] getRunningActivities: total=%d", allActivities.count)
            
            let activitiesData = allActivities.map { activity -> [String: Any] in
                let pushToken = activity.pushToken
                    .map { $0.map { String(format: "%02x", $0) }.joined() } ?? ""
                
                let stateStr: String
                switch activity.activityState {
                case .active: stateStr = "active"
                case .ended: stateStr = "ended"
                case .dismissed: stateStr = "dismissed"
                case .stale: stateStr = "stale"
                @unknown default: stateStr = "unknown"
                }
                
                NSLog("[LiveActivityBridge]   activity %@ state=%@", activity.id, stateStr)
                
                return [
                    "activityId": activity.id,
                    "pushToken": pushToken,
                    "departureAirport": activity.attributes.departureAirport,
                    "arrivalAirport": activity.attributes.arrivalAirport,
                    "arrivalTerminal": activity.attributes.arrivalTerminal,
                    "journeyProgress": activity.contentState.journeyProgress,
                    "state": stateStr
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
