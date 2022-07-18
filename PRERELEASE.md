
# Using Pre-Release Extensions

If you would like to use Optimize or Messaging before they have been released, you can use the following steps to install them onto your app

## Steps to Install Optimize and Messaging

- Place Optimize and Messaging packages folder into app repo or directory of your choosing
- In your app repository, run 
  ```javascript
  npm install (path/to/optimize) (path/to/messaging)
  ``` 
  to install the local version of the package to your app

### Android
- Inside android/app.gradle add the following into the two repositories blocks in the file `maven { url "https://oss.sonatype.org/content/repositories/snapshots/" }`

### IOS
- Inside Podfile, add the following line inside the target block `pod "AEPMessaging", :git => "https://github.com/adobe/aepsdk-messaging-ios.git", :branch => "staging"`
