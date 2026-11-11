/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Additional data delivered with the mbox content to a {@link TargetDetailedCallback}.
 * Keys are present only when available in the Target response.
 */
export interface TargetResponseData {
  /** Response tokens. */
  responseTokens?: Record<string, any>;
  /** Analytics for Target (A4T) payload. */
  'analytics.payload'?: Record<string, string>;
  /** Click tracking A4T payload. */
  'clickmetric.analytics.payload'?: Record<string, string>;
  [key: string]: any;
}

/** Error reported to {@link TargetDetailedCallback.fail}. */
export interface TargetCallbackError {
  code: number;
  message: string;
}

/**
 * Callback for a TargetRequestObject that, in addition to the content, receives the response
 * tokens and A4T payloads. Mirrors the native `AdobeTargetDetailedCallback` (Android) and
 * `contentWithDataCallback` (iOS).
 */
export interface TargetDetailedCallback {
  /** Invoked with the mbox content and the optional response data. */
  call: (content: string | null, data: TargetResponseData | null) => void;
  /** Invoked when the content could not be retrieved. Android only. */
  fail?: (error: TargetCallbackError) => void;
}
