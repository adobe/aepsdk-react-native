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

import AEPMessaging

public class RCTAEPMessagingDataBridge: NSObject {
    static func transformToMessage(message: Message) -> [String: Any] {
        return [
            "id": message.id, "autoTrack": message.autoTrack
        ]
    }

    static func transformPropositionDict(dict: [Surface: [Proposition]]) -> [String: [Any?]]
    {
        let bundleID = "mobileapp://" + Bundle.main.bundleIdentifier! + "/"
        return dict.reduce(into: [:]) { result, element in
            result[element.key.uri.replacingOccurrences(of: bundleID, with: "")] = element.value
                .map({ $0.asDictionary() })
        }
    }

    /// Extracts the activity identifier from a proposition dictionary at scopeDetails.activity.id
    static func extractActivityId(from propositionDict: [String: Any]) -> String? {
        guard let scopeDetails = propositionDict["scopeDetails"] as? [String: Any],
              let activity = scopeDetails["activity"] as? [String: Any],
              let id = activity["id"] as? String, !id.isEmpty else {
            return nil
        }
        return id
    }
}
