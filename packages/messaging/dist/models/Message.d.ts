declare class Message {
    id: string;
    autoTrack: boolean;
    constructor({ id, autoTrack }: {
        id: string;
        autoTrack: boolean;
    });
    /**
     * Update the value of property "autoTrack"
     * This function works only for the Message objects that were saved by calling "Messaging.saveMessage"
     * @param {boolean} autoTrack: New value of property autoTrack.
     */
    setAutoTrack(autoTrack: boolean): void;
    /**
     * Signals to the UIServices that the message should be shown.
     * If autoTrack is true, calling this method will result in an "inapp.display" Edge Event being dispatched.
     */
    show(): void;
    /**
     * Signals to the UIServices that the message should be dismissed.
     * If `autoTrack` is true, calling this method will result in an "inapp.dismiss" Edge Event being dispatched.
     * @param {boolean?} suppressAutoTrack: if set to true, the inapp.dismiss Edge Event will not be sent regardless
     * of the autoTrack setting.
     */
    dismiss(suppressAutoTrack?: boolean): void;
    /**
     * Generates an Edge Event for the provided interaction and eventType.
     * @param {string?} interaction: a custom String value to be recorded in the interaction
     * @param {MessagingEdgeEventType} eventType: the MessagingEdgeEventType to be used for the ensuing Edge Event
     */
    track(interaction: string, eventType: number): void;
    /**
     * Clears the cached reference to the Message object.
     * This function must be called if Message was saved by calling "MessagingDelegate.shouldSaveMessage" but no longer needed.
     * Failure to call this function leads to memory leaks.
     */
    clear(): void;
    /**
     * Adds a handler for named JavaScript messages sent from the message's WebView.
     * The parameter passed to handler will contain the body of the message passed from the WebView's JavaScript.
     * @param {string} handlerName: The name of the message that should be handled by the handler
     * @param {function} handler: The method or closure to be called with the body of the message created in the Message's JavaScript
     */
    handleJavascriptMessage(handlerName: string, handler: (content: string) => void): void;
    /**
     * @internal - For internal use only.
     * Clears all the javascript message handlers for the message.
     * This function must be called if the callbacks registered in handleJavascriptMessage are no longer needed.
     * Failure to call this function may lead to memory leaks.
     */
    _clearJavascriptMessageHandlers(): void;
}
export default Message;
