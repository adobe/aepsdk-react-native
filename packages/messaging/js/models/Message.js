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
import { NativeModules } from 'react-native';
const RCTAEPMessaging = NativeModules.AEPMessaging;
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

    /** 
    * Update the value of property "autoTrack"
    * This funtion works only for the Message objects that were saved by calling "Messaging.saveMessage"
    * @param {boolean} autoTrack: New value of property autoTrack.
     */
    setAutoTrack = (autoTrack: boolean) => {
        this.autoTrack = autoTrack;
        RCTAEPMessaging.setAutoTrack(this.id, autoTrack);
    };

    /**
    * Signals to the UIServices that the message should be shown.
    * If autoTrack is true, calling this method will result in an "inapp.display" Edge Event being dispatched.
    */
    show = () => {        
        RCTAEPMessaging.show(this.id);
    };

    /**
    * Signals to the UIServices that the message should be dismissed.
    * If `autoTrack` is true, calling this method will result in an "inapp.dismiss" Edge Event being dispatched.
    * @param {?boolean} suppressAutoTrack: if set to true, the inapp.dismiss Edge Event will not be sent regardless
    * of the autoTrack setting.
    */
    dismiss = (suppressAutoTrack: ?boolean = false) => {
        RCTAEPMessaging.dismiss(this.id, suppressAutoTrack);
    };

    /**
    * Generates an Edge Event for the provided interaction and eventType.        
    * @param {string?} interaction: a custom String value to be recorded in the interaction
    * @param {MessagingEdgeEventType} eventType: the MessagingEdgeEventType to be used for the ensuing Edge Event
     */
    track = (interaction: ?string, eventType: MessagingEdgeEventType) => {
        RCTAEPMessaging.track(this.id, interaction, eventType.value);
    };

    /**
    * Adds a handler for Javascript messages sent from the message's webview.    
    * The parameter passed to `handler` will contain the body of the message passed from the webview's Javascript.        
    * @param {string} name: the name of the message that should be handled by `handler`
    * @return {Promise<any?>}: the Promise to be resolved with the body of the message passed by the Javascript message in the WebView
    */
    handleJavascriptMessage = (name: string) : Promise<?any> => {
        return Promise.resolve(RCTAEPMessaging.handleJavascriptMessage(this.id, name));
    };

    /**
    * Clears the reference to the Message object. 
    * This function must be called if Mesage was saved by calling "Messaging.saveMessage" but no longer needed. 
    * Failure to call this function leads to memory leaks.
     */
    clearMessage = () => {
        RCTAEPMessaging.clearMessage(this.id);
    };    
}