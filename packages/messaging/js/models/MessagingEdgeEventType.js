/*
Copyright 2022 Adobe. All rights reserved.
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
class MessagingEdgeEventType {

    static IN_APP_DISMISS = new MessagingEdgeEventType(0);
    static IN_APP_INTERACT = new MessagingEdgeEventType(1);
    static IN_APP_TRIGGER = new MessagingEdgeEventType(2);
    static IN_APP_DISPLAY = new MessagingEdgeEventType(3);
    static PUSH_APPLICATION_OPENED = new MessagingEdgeEventType(4);
    static PUSH_CUSTOM_ACTION = new MessagingEdgeEventType(5);

    value: number;
    constructor(value: number) {
        this.value = value;
    }        
};

module.exports = MessagingEdgeEventType;