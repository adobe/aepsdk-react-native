# Native handling of JavaScript events

You can handle events from in-app message interactions natively within your application by completing the following steps:
- [Implement and assign a `Messaging Delegate`](#implement-and-assign-a-messaging-delegate)
- [Register a JavaScript handler for your In-App Message](#register-a-javascript-handler-for-your-in-app-message)
- [Post the JavaScript message from your In-App Message](#post-the-javascript-message-from-your-in-app-message)

## Implement and assign a `Messaging Delegate`

To register a JavaScript event handler with a Message object, you will first need to implement and set a MessagingDelegate.
Please read the [documentation](../README.md/#programmatically-control-the-display-of-in-app-messages) for more detailed instructions on implementing and using a MessagingDelegate.

## Register a JavaScript handler for your In-App Message

In the `onShow` function of `MessagingDelegate`, call `handleJavascriptMessage(messageId: string, handlerName: string, callback: (content: string) => void)` to register your handler.

The name of the message you intend to pass from the JavaScript side should be specified in the first parameter.

### Example

```typescript
Messaging.setMessagingDelegate({
    onShow: msg => {
      console.log('show', msg);
      Messaging.handleJavascriptMessage(
        msg.id,
        'myInappCallback',
        (content) => {
          console.log('Received webview content:', content);
        }
      );
    }
  });
```

## Post the JavaScript message from your In-App Message

Now that the in-app message has been displayed, the final step is to post the JavaScript message.

Continuing from the previous example, the developer is going to post the `myInappCallback` message from their HTML, which will in turn call the handler previously configured:

```html
<html>
    <head>
        <script type="text/javascript">
            function callNative(action) {
                try {
                    // the name of the message handler is the same name that must be registered in  react native code.
                    // in this case the message name is "myInappCallback"
                    webkit.messageHandlers.myInappCallback.postMessage(action);
                } catch(err) {
                    console.log('The native context does not exist yet'); }
                }
            </script>
    </head>
    <body>
        <button onclick="callNative('callbacks are cool!')">Native callback!</button>
    </body>
</html>
```

Note: (The above HTML is not representative of a valid in-app message, and is intended only to demonstrate how to post the JavaScript message).

When the user clicks the button inside of this in-app message, the handler configured in the previous step will be called. The handler will send an Experience Event tracking the interaction, and print the following message to the console:

```bash
JavaScript body passed to react native callback: callbacks are cool!
```
