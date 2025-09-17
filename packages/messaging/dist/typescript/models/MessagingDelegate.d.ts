import Message from './Message';
export interface MessagingDelegate {
    /**
     * Invoked when the any message is displayed
     * @param {Message} message: Message that is being displayed.
     */
    onShow?(message: Message): void;
    /**
     * Invoked when any message is dismissed
     * @param {Message} message: Message that is being dismissed
     */
    onDismiss?(message: Message): void;
    /**
     * Used to determine whether a message should be cached, so it can be used later. Return true if the message should be cached.
     * Note: Message must be cached in order to call any of the functions of the message object
     */
    shouldSaveMessage?(message: Message): boolean;
    /**
     * Used to find whether messages should be shown or not
     * @param {Message} message: Message that is about to get displayed
     * @returns {boolean}: true if the message should be shown else false
     */
    shouldShowMessage?(message: Message): boolean;
    /**
     * IOS Only - Called when message loads a URL
     * @param {string} url: the URL being loaded by the message
     * @param {Message} message: the Message loading a URL
     */
    urlLoaded?(url: string, message: Message): void;
    /**
     * Android Only - Called when message loads
     * @param {Message} message: the Message loaded
     */
    onContentLoaded?(message: Message): void;
}
//# sourceMappingURL=MessagingDelegate.d.ts.map