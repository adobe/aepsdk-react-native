# Migrate to the Experience Platform SDK libraries (AEP 1.x) for React Native

If you have implemented SDK's older React Native libraries (ACP-prefixed React Native libraries, 2.x or lower) in your mobile app, then the following steps will help you migrate your implementation to the latest React Native libraries(AEP-prefixed React Native libraries, 1.x or higher).

## Switch dependent packages

Open your app's package.json file and replace the ACP-prefixed packages with the corresponding AEP-prefixed packages. For example, the following code snippet shows the changes for `core` library:
```diff
...

"dependencies": {
    "react-native": "0.64.2",
-   "@adobe/react-native-acpcore": "^2.0.0"
+   "@adobe/react-native-aepcore": "^1.0.0",
    ...
},

```
At this time, the following ACP-prefix libraries can be switched out with their respective AEP-prefix libraries.  However, ACP and AEP React Native libraries are not compatible. For extensions not supported in AEP-prefixed libraries, you should remove those packages from your package.json file. 

| React Native (ACP 2.x) | React Native (AEP 1.x) |
| :--- | :--- |
| @adobe/react-native-acpcore | @adobe/react-native-aepcore |
| @adobe/react-native-acpuserprofile | @adobe/react-native-aepuserprofile |
| @adobe/react-native-acpplaces | NA |
| @adobe/react-native-acpplaces-monitor | NA |
| @adobe/react-native-acpanalytics | NA |
| @adobe/react-native-acpmedia | NA |
| @adobe/react-native-acpaudience | NA |
| @adobe/react-native-acptarget | NA |
| @adobe/react-native-acpcampaign | NA |
| @adobe/react-native-aepassurance:2.x (compatible with ACP libraries) | @adobe/react-native-aepassurance:3.x (compatible with AEP libraries)|

<!--- TODO: add more descritions for Assurance library?? --->

## Update SDK initialization
Remove the registration code for extensions that are not supported in AEP React Native libraries.
### Android
```diff
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Identity;
import com.adobe.marketing.mobile.InvalidInitException;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Signal;
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
-   MobileCore.setWrapperType(WrapperType.REACT_NATIVE);

    try {
      UserProfile.registerExtension();
      Identity.registerExtension();
      Lifecycle.registerExtension();
      Signal.registerExtension();
-     Analytics.registerExtension();
-     Target.registerExtension();
-     Places.registerExtension();
-     Campaign.registerExtension();
      MobileCore.start(new AdobeCallback () {
          @Override
          public void call(Object o) {
            MobileCore.configureWithAppID("yourAppID");
         }
      });
    } catch (InvalidInitException e) {
      ...
    }
  }
}
```
### iOS

> Note: For iOS app, after installing the AEP-prefixed packages, please update native dependecies by running the following command: `cd ios && pod update && cd ..`

```objectivec

// 1. remove the following header files
//#import "ACPCore.h"
//#import "ACPUserProfile.h"
//#import "ACPIdentity.h"
//#import "ACPLifecycle.h"
//#import "ACPSignal.h"

// 2. import AEP extensions
@import AEPCore;
@import AEPServices;
@import AEPSignal;
@import AEPLifecycle;
//  --- 2. end ----

...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // 3. remove the following code for initializing ACP SDKs

    // [ACPCore setLogLevel:ACPMobileLogLevelDebug];
    // [ACPCore configureWithAppId:@"yourAppID"];
    // [ACPUserProfile registerExtension];
    // [ACPIdentity registerExtension];
    // [ACPLifecycle registerExtension];
    // [ACPSignal registerExtension];
    // [ACPAnalytics registerExtension];
    // [ACPCampaign registerExtension];
    // [ACPTarget registerExtension];

    // const UIApplicationState appState = application.applicationState;
    // [ACPCore start:^{
    //   if (appState != UIApplicationStateBackground) {
    //     [ACPCore lifecycleStart:nil];
    //   }
    // }];

    // 4. add code to initializing AEP SDKs

    [AEPMobileCore setLogLevel: AEPLogLevelDebug];
    [AEPMobileCore configureWithAppId:@"yourAppID"];
    [AEPMobileCore registerExtensions: @[
        AEPMobileLifecycle.class,
        AEPMobileSignal.class,
        AEPMobileIdentity.class,
        AEPMobileUserProfile.class,
    ] completion:^{
    [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
  }
  ];
  //  --- 4. end ----

    ...
  return YES;
}

@end
```
## Update API usage and references for each extension

### Core

#### collectPii
- ACP (2.x)
```javascript
ACPCore.collectPii(data: [String : String])
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#collecting-pii)
```typescript
MobileCore.collectPii(data: Record<string, string>)
```

#### dispatchEvent
- ACP (2.x)
```javascript
ACPCore.dispatchEvent(event: ACPExtensionEvent): Promise<boolean>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#dispatchevent)
```typescript
MobileCore.dispatchEvent(event: Event): Promise<boolean>
```

#### dispatchEventWithResponseCallback
- ACP (2.x)
```javascript
ACPCore.dispatchEventWithResponseCallback(event: ACPExtensionEvent): Promise<ACPExtensionEvent>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#dispatcheventwithresponsecallback)
```typescript
MobileCore.dispatchEventWithResponseCallback(event: Event): Promise<Event>
```

#### extensionVersion
- ACP (2.x)
```javascript
ACPCore.extensionVersion(): Promise<string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#extensionversion)
```typescript
MobileCore.extensionVersion(): Promise<string>
```

#### getLogLevel
- ACP (2.x)
```javascript
ACPCore.getLogLevel(): Promise<string> 
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getloglevel)
```typescript
MobileCore.getLogLevel(): Promise<LogLevel>
```

#### getSdkIdentities
- ACP (2.x)
```javascript
ACPCore.getSdkIdentities(): Promise<?string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getsdkidentities)
```typescript
MobileCore.getSdkIdentities(): Promise<string>
```

#### getPrivacyStatus
- ACP (2.x)
```javascript
ACPCore.getPrivacyStatus(): Promise<string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getprivacystatus)
```typescript
MobileCore.getPrivacyStatus(): Promise<string>
```

#### log
- ACP (2.x)
```javascript
ACPCore.log(logLevel: string, tag: string, message: string)
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#log)
```typescript
MobileCore.log(logLevel: LogLevel, tag: string, message: string)
```

#### resetIdentities
- ACP (2.x)
```javascript
ACPCore.resetIdentities()
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#resetidentities)
```typescript
MobileCore.resetIdentities()
```

#### setPrivacyStatus
- ACP (2.x)
```javascript
ACPCore.setPrivacyStatus(privacyStatus: string) 
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#setprivacystatus)
```typescript
MobileCore.setPrivacyStatus(privacyStatus: string) 
```

#### setLogLevel
- ACP (2.x)
```javascript
ACPCore.setLogLevel(mode: string)
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#setloglevel)
```typescript
MobileCore.setLogLevel(mode: LogLevel)
```

#### updateConfiguration
- ACP (2.x)
```javascript
ACPCore.updateConfiguration(configMap?: { string: any })
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#updateconfiguration)
```typescript
MobileCore.updateConfiguration(configMap?: Record<string, any>)
```

### Identity

#### appendVisitorInfoForURL
- ACP (2.x)
```javascript
ACPIdentity.appendVisitorInfoForURL(baseURL?: String): Promise<?string> 
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#appendvisitorinfoforurl)
```typescript
Identity.appendVisitorInfoForURL(baseURL?: String): Promise<string>
```

#### extensionVersion
- ACP (2.x)
```javascript
ACPIdentity.extensionVersion(): Promise<string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#extensionversion-1)
```typescript
Identity.extensionVersion(): Promise<string>
```

#### getUrlVariables
- ACP (2.x)
```javascript
ACPIdentity.getUrlVariables(): Promise<?string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#geturlvariables)
```typescript
Identity.getUrlVariables(): Promise<string>
```
 
#### getIdentifiers
- ACP (2.x)
```javascript
ACPIdentity.getIdentifiers(): Promise<Array<?ACPVisitorID>> 
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getidentifiers)
```typescript
Identity.getIdentifiers(): Promise<Array<VisitorID>>
```

#### getExperienceCloudId
- ACP (2.x)
```javascript
ACPIdentity.getExperienceCloudId(): Promise<?string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getexperiencecloudid)
```typescript
Identity.getExperienceCloudId(): Promise<string>
```


#### syncIdentifier
- ACP (2.x)
```javascript
ACPIdentity.syncIdentifiers(identifiers?: { string: string })
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#syncidentifier)
```typescript
Identity.syncIdentifiers(identifiers?: Record<string, string>)
```


#### syncIdentifiersWithAuthState
- ACP (2.x)
```javascript
ACPIdentity.syncIdentifiersWithAuthState(identifiers?: { string: string }, authenticationState: string) 
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#syncidentifierswithauthstate)
```typescript
Identity.syncIdentifiersWithAuthState(identifiers: Record<string, string> | null, authenticationState: MobileVisitorAuthenticationState)
```


#### setAdvertisingIdentifier
- ACP (2.x)
```javascript
ACPCore.setAdvertisingIdentifier(advertisingIdentifier?: String)
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#setadvertisingidentifier)
```typescript
MobileCore.setAdvertisingIdentifier(advertisingIdentifier?: string)
```

#### setPushIdentifier
- ACP (2.x)
```javascript
ACPCore.setPushIdentifier(pushIdentifier?: String) 
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#setpushidentifier)
```typescript
MobileCore.setPushIdentifier(pushIdentifier?: string) 
```

### Lifecycle

#### extensionVersion
- ACP (2.x)
```javascript
ACPLifecycle.extensionVersion(): Promise<string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#extensionversion-2)
```typescript
Lifecycle.extensionVersion(): Promise<string>
```

### Signal

#### extensionVersion
- ACP (2.x)
```javascript
ACPSignal.extensionVersion(): Promise<string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#extensionversion-3)
```typescript
Signal.extensionVersion(): Promise<string>
```

### UserProfile

#### extensionVersion
- ACP (2.x)
```javascript
ACPUserProfile.extensionVersion(): Promise<string>
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/userprofile/README.md#extensionversion)
```typescript
UserProfile.extensionVersion(): Promise<string>
```

#### removeUserAttributes
- ACP (2.x)
```javascript
ACPUserProfile.removeUserAttribute(attributeName: string)
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/userprofile/README.md#removeuserattributes)
```typescript
UserProfile.removeUserAttributes(attributeNames: Array<string>)
```

#### updateUserAttributes
- ACP (2.x)
```javascript
ACPUserProfile.updateUserAttributes(attributeMap: { string: any })
```
```javascript
ACPUserProfile.updateUserAttribute(attributeName: string, attributeValue: string)
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/userprofile/README.md#updateuserattributes)
```typescript
UserProfile.updateUserAttributes(attributeMap: Record<string, any>)
```