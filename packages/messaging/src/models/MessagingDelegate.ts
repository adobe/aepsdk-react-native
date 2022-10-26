/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import Message from "./Message";

export type MessagingDelegate = {    
    /**
    * Invoked when the any message is displayed
    * @param {Message} message: Message that is being displayed.
    */
    onShow(message: Message): void;

    /**
     * Invoked when any message is dismissed
     * @param {Message} message: Message that is being dismissed
     */
    onDismiss(message: Message): void;

    /**
     * Used to find whether messages should be shown or not
     * @param {Message} message: Message that is about to get displayed
     * @returns {boolean}: true if the message should be shown else false 
     */
    shouldShowMessage(message: Message): boolean;

    /**
    * Called when message loads a URL
    * @param {string} url: the URL being loaded by the message
    * @param {Message} message: the Message loading a URL
    */
    urlLoaded(url: string, message: Message): void;
};