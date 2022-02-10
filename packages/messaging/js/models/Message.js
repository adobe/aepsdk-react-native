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

const MessagingEdgeEventType = require("./MessagingEdgeEventType");
const Messaging = require("../Messaging");

export class Message {    
    id: string;
    autoTrack: boolean;    

    constructor(id: string, autoTrack: boolean) {
        this.id = id;
        this.autoTrack = autoTrack;
        this.show.bind(this);
        this.dismiss.bind(this);
        this.track.bind(this);
        this.handleJavascriptMessage.bind(this);
        this.clearMessage.bind(this);
    }

    show = () => {
        console.log(`Inside the Message:: id is: ${this.id}`);
        Messaging.show(this.id);
    }

    dismiss = (suppressAutoTrack: boolean = false) => {
        Messaging.dismiss(this.id, suppressAutoTrack);
    }

    track = (interaction: ?string, eventType: MessagingEdgeEventType) => {
        Messaging.track(this.id, interaction, eventType.value);
    }

    handleJavascriptMessage = (name: string) : Promise<?any> => {
        return Messaging.handleJavascriptMessage(this.id, name);
    }

    clearMessage = () => {
        Messaging.clearMessage(this.id);
    }
}