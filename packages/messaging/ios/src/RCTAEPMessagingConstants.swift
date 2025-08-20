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

class Constants {
    static let CACHE_MISS = "No message found in cache. Please ensure you have cached the message"
    static let ON_DISMISS_EVENT = "onDismiss"
    static let ON_SHOW_EVENT = "onShow"
    static let SHOULD_SHOW_MESSAGE_EVENT = "shouldShowMessage"
    static let URL_LOADED_EVENT = "urlLoaded"
    static let ON_JAVASCRIPT_MESSAGE_EVENT = "onJavascriptMessage"
    static let SUPPORTED_EVENTS = [
        ON_DISMISS_EVENT, ON_SHOW_EVENT, SHOULD_SHOW_MESSAGE_EVENT, URL_LOADED_EVENT, ON_JAVASCRIPT_MESSAGE_EVENT
    ]
    static let MESSAGE_ID_KEY = "messageId"
    static let HANDLER_NAME_KEY = "handlerName"
    static let CONTENT_KEY = "content"
}
