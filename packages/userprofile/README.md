
# React Native Adobe Experience Platform User Profile Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)

`@adobe/react-native-aepcore` is a wrapper around the iOS and Android [Adobe Experience Platform User Profile Extension](https://developer.adobe.com/client-sdks/documentation/profile) to allow for integration with React Native applications.


## Prerequisites

The UserProfile extension has the following peer dependency, which must be installed prior to installing the UserProfile extension:
- [Core](../core/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Install the `@adobe/react-native-aepuserprofile` package:

```bash
npm install @adobe/react-native-aepuserprofile
```

## Usage

### Initializing and registering the extension

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

**Initialization Example**

iOS
```objc
// AppDelegate.h
@import AEPCore;
@import AEPUserProfile;
...
@implementation AppDelegate

// AppDelegate.m
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [AEPMobileCore setLogLevel: AEPLogLevelDebug];
    // register UserProfile extension
    [AEPMobileCore registerExtensions:@[AEPMobileUserProfile.class] completion:^{
        [AEPMobileCore configureWithAppId:@"yourAppID"];  
    ...   
   }]; 
   return YES;   
 } 

@end
```

Android
```java
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.UserProfile;
  
...
import android.app.Application;
...
public class MainApplication extends Application implements ReactApplication {
  ...
  @Override
  public void on Create(){
    super.onCreate();
    ...
    MobileCore.setApplication(this);
    MobileCore.setLogLevel(LoggingMode.DEBUG);
    MobileCore.configureWithAppID("yourAppID");

    UserProfile.registerExtension();// register UserProfile extension

    MobileCore.start(new AdobeCallback() {
        @Override
        public void call(Object o) {
        
        }});
    }
}     
```

#### Importing the extension:

In your React Native application, import the UserProfile extension as follows:

```typescript
import {UserProfile} from '@adobe/react-native-aepuserprofile';
```

## API reference

### extensionVersion

Returns the version of the User Profile extension

**Syntax**

```typescript
extensionVersion(): Promise<string>
```

**Example**

```typescript
UserProfile.extensionVersion().then(version => console.log("AdobeExperienceSDK: UserProfile version: " + version));
```

### getUserAttributes

Gets the user profile attributes with the given keys.

**Syntax**

```typescript
getUserAttributes(attributeNames: Array<string>): Promise<Record<string, any>>
```

**Example**

```typescript
UserProfile.getUserAttributes(["mapKey", "mapKey1"]).then(map => console.log("AdobeExperienceSDK: UserProfile getUserAttributes: " + map));
```

### removeUserAttributes

Removes the user profile attributes for the given keys.

**Syntax**

```typescript
removeUserAttributes(attributeNames: Array<string>)
```

**Example**

```typescript
UserProfile.removeUserAttributes(["mapKey1"]);
```

### updateUserAttributes

Sets the user profile attributes key and value.
It allows to create/update a batch of user profile attributes.

**Syntax**

```typescript
updateUserAttributes(attributeMap: Record<string, any>)
```

**Example**

```typescript
let attrMap = {"mapKey": "mapValue", "mapKey1": "mapValue1"};
UserProfile.updateUserAttributes(attrMap);
```
