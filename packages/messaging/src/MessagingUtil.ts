import { MessagingCacheUtil } from './Messaging';

class MessagingUtil {
  static cacheJavascriptCallback(messageId: string, handlerName: string, callback: (content: string) => void) {
    MessagingCacheUtil.cacheJavascriptCallback(messageId, handlerName, callback);
  }
}

export default MessagingUtil;