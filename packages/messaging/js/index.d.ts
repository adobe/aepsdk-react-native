/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

*/
export class Messaging {
    static extensionVersion(): Promise<string>;
    static setMessagingDelegate(delegate: MessagingDelegate);
    static refreshInAppMessages();
    static saveMessage(message: Message);
};

export class Message {
    id: string;
    autoTrack: boolean;    

    constructor(id: string, autoTrack: boolean);
    setAutoTrack(autoTrack: boolean);    
    show();
    dismiss(suppressAutoTrack: ?boolean = false);
    track(interaction: ?string, eventType: MessagingEdgeEventType);
    handleJavascriptMessage(name: string) : Promise<?any>;
    clear();
};

export type MessagingDelegate = {        
    onShow(message: Message);
    onDismiss(message: Message);
    shouldShowMessage(message: Message): boolean;
    urlLoaded(url: string, message: Message);
};

export enum MessagingEdgeEventType {
    IN_APP_DISMISS = 0,
    IN_APP_INTERACT = 1,
    IN_APP_TRIGGER = 2,
    IN_APP_DISPLAY = 3,
    PUSH_APPLICATION_OPENED = 4,
    PUSH_CUSTOM_ACTION = 5    
};