/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/

'use strict';

const IN_APP_DISMISS = 0
const IN_APP_INTERACT = 1
const IN_APP_TRIGGER = 2
const IN_APP_DISPLAY = 3
const PUSH_APPLICATION_OPENED = 4
const PUSH_CUSTOM_ACTION = 5

class MessagingEdgeEventType {
    
    static get inappDismiss() {
        return IN_APP_DISMISS;
    }

    static get inappInteract() {
        return IN_APP_INTERACT;
    }

    static get inappTrigger() {
        return IN_APP_TRIGGER;
    }

    static get inappDisplay() {
        return IN_APP_DISPLAY;
    }

    static get pushApplicationOpened() {
        return PUSH_APPLICATION_OPENED;
    }

    static get pushCustomAction() {
        return PUSH_CUSTOM_ACTION;
    }
}

module.exports = MessagingEdgeEventType;