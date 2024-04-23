# Migrate to the Experience Platform SDK libraries (AEP) for React Native

If you have implemented SDK's older React Native libraries (ACP-prefixed React Native libraries) in your mobile app, then the following steps will help you migrate your implementation to the latest React Native libraries(AEP-prefixed React Native libraries).

## Switch dependent packages

Open your app's package.json file and replace the ACP-prefixed packages with the corresponding AEP-prefixed packages. For example, the following code snippet shows the changes for `core` library:
```diff
...

"dependencies": {
    "react-native": "0.64.2",
-   "@adobe/react-native-acpcore": "^2.0.0"
+   "@adobe/react-native-aepcore": "^6.0.0",
    ...
},

```
At this time, the following ACP-prefix libraries can be switched out with their respective AEP-prefix libraries.  However, ACP and AEP React Native libraries are not compatible. For extensions not supported in AEP-prefixed libraries, you should remove those packages from your package.json file. 

| React Native (ACP) | React Native (AEP) |
| :--- | :--- |
| @adobe/react-native-acpcore | @adobe/react-native-aepcore |
| @adobe/react-native-acpuserprofile | @adobe/react-native-aepuserprofile |
| @adobe/react-native-acpplaces | @adobe/react-native-aepplaces |
| @adobe/react-native-acpplaces-monitor | NA |
| @adobe/react-native-acpanalytics | NA, **Analytics workflows supported through [Edge Network](https://github.com/adobe/aepsdk-react-native/tree/main/packages/edge) or [Edge Bridge](https://github.com/adobe/aepsdk-react-native/tree/main/packages/edgebridge) extensions**. Please refer to the **Note** below. |
| @adobe/react-native-acpmedia | NA |
| @adobe/react-native-acpaudience | NA |
| @adobe/react-native-acptarget | @adobe/react-native-aeptarget, <br> Analytics for Target (A4T) is not supported.  If you want to use the A4T workflow,  it is supported through [Edge Network](https://github.com/adobe/aepsdk-react-native/tree/main/packages/edge) and [Optimize](https://github.com/adobe/aepsdk-react-native/tree/main/packages/optimize) extensions. |
| @adobe/react-native-acpcampaign | NA |
| @adobe/react-native-aepassurance:2.x (compatible with ACP libraries) | @adobe/react-native-aepassurance:4.x (compatible with AEP libraries)|

> **Note**: Analytics library is not supported in AEP React Native. For implementing the Analytics workflow, register and configure the Edge Network or Edge Bridge libraries. Please refer to [migrate to Edge Network](https://developer.adobe.com/client-sdks/documentation/adobe-analytics/migrate-to-edge-network/) for more info.

## Update SDK initialization
Remove the deprecated registration code and the extensions that are not supported in AEP React Native libraries.

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
import com.adobe.marketing.mobile.Target;
import com.adobe.marketing.mobile.Places;
import com.adobe.marketing.mobile.Assurance;
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

-    try {
-     UserProfile.registerExtension();
-     Identity.registerExtension();
-     Lifecycle.registerExtension();
-     Signal.registerExtension();
-     Analytics.registerExtension();
-     Target.registerExtension();
-     Places.registerExtension();
-     Campaign.registerExtension();
-     Assurance.registerExtension();
-     MobileCore.start(new AdobeCallback () {
-          @Override
-          public void call(Object o) {
-            MobileCore.configureWithAppID("yourAppID");
-         }
-      });
-    } catch (InvalidInitException e) {

  List<Class<? extends Extension>> extensions = Arrays.asList(
      UserProfile.EXTENSION
      Identity.EXTENSION,
      Lifecycle.EXTENSION,
      Signal.EXTENSION,
      Target.EXTENSION,
      Places.EXTENSION,
      Assurance.EXTENSION,
  );
  MobileCore.registerExtensions(extensions, o -> MobileCore.configureWithAppID("YourEnvironmentFileID"));
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
//#import "ACPTarget.h"
//#import "ACPCampaign.h"
//#import "ACPPlaces.h"
//#import "AEPAssurance.h"

// 2. import AEP extensions
@import AEPCore;
@import AEPUserProfile;
@import AEPServices;
@import AEPIdentity;
@import AEPLifecycle;
@import AEPSignal;
@import AEPTarget;
@import AEPPlaces;
@import AEPAssurance;
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
    // [ACPTarget registerExtension];
    // [ACPCampaign registerExtension];
    // [ACPPlaces registerExtension];

    // const UIApplicationState appState = application.applicationState;
    // [ACPCore start:^{
    //   if (appState != UIApplicationStateBackground) {
    //     [ACPCore lifecycleStart:nil];
    //   }
    // }];

    // 4. add code to initializing AEP SDKs

    [AEPMobileCore setLogLevel: AEPLogLevelDebug];
    [AEPMobileCore configureWithAppId:@"yourAppID"];

    const UIApplicationState appState = application.applicationState;

    [AEPMobileCore registerExtensions: @[
        AEPMobileUserProfile.class,
        AEPMobileIdentity.class,
        AEPMobileLifecycle.class,
        AEPMobileSignal.class,
        AEPMobileTarget.class,
        AEPMobilePlaces.class,
        AEPMobileAssurance.class,
    ] completion:^{
      if (appState != UIApplicationStateBackground) {
       [AEPMobileCore lifecycleStart:nil];
      }
    }];
  //  --- 4. end ----

    ...
  return YES;
}

@end
```
## Update API usage and references for each extension

### Core

#### collectPii
- ACP
```javascript
ACPCore.collectPii(data: [String : String])
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#collectpii)
```typescript
MobileCore.collectPii(data: Record<string, string>)
```

#### dispatchEvent
- ACP
```javascript
ACPCore.dispatchEvent(event: ACPExtensionEvent): Promise<boolean>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#dispatchevent)
```typescript
MobileCore.dispatchEvent(event: Event): Promise<boolean>
```

#### dispatchEventWithResponseCallback
- ACP
```javascript
ACPCore.dispatchEventWithResponseCallback(event: ACPExtensionEvent): Promise<ACPExtensionEvent>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#dispatcheventwithresponsecallback)
```typescript
MobileCore.dispatchEventWithResponseCallback(event: Event, timeoutMS:Number): Promise<Event>
```

#### extensionVersion
- ACP
```javascript
ACPCore.extensionVersion(): Promise<string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#extensionversion)
```typescript
MobileCore.extensionVersion(): Promise<string>
```

#### getLogLevel
- ACP
```javascript
ACPCore.getLogLevel(): Promise<string> 
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getloglevel)
```typescript
MobileCore.getLogLevel(): Promise<LogLevel>
```

#### getSdkIdentities
- ACP
```javascript
ACPCore.getSdkIdentities(): Promise<?string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getsdkidentities)
```typescript
MobileCore.getSdkIdentities(): Promise<string>
```

#### getPrivacyStatus
- ACP
```javascript
ACPCore.getPrivacyStatus(): Promise<string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getprivacystatus)
```typescript
MobileCore.getPrivacyStatus(): Promise<string>
```

#### log
- ACP
```javascript
ACPCore.log(logLevel: string, tag: string, message: string)
```
- AEP

  Not Supported.

#### resetIdentities
- ACP
```javascript
ACPCore.resetIdentities()
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#resetidentities)
```typescript
MobileCore.resetIdentities()
```

#### setPrivacyStatus
- ACP
```javascript
ACPCore.setPrivacyStatus(privacyStatus: string) 
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#setprivacystatus)
```typescript
MobileCore.setPrivacyStatus(privacyStatus: string) 
```

#### setLogLevel
- ACP
```javascript
ACPCore.setLogLevel(mode: string)
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#setloglevel)
```typescript
MobileCore.setLogLevel(mode: LogLevel)
```

#### updateConfiguration
- ACP
```javascript
ACPCore.updateConfiguration(configMap?: { string: any })
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#updateconfiguration)
```typescript
MobileCore.updateConfiguration(configMap?: Record<string, any>)
```

### Identity

#### appendVisitorInfoForURL
- ACP
```javascript
ACPIdentity.appendVisitorInfoForURL(baseURL?: String): Promise<?string> 
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#appendvisitorinfoforurl)
```typescript
Identity.appendVisitorInfoForURL(baseURL?: String): Promise<string>
```

#### extensionVersion
- ACP
```javascript
ACPIdentity.extensionVersion(): Promise<string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#extensionversion-1)
```typescript
Identity.extensionVersion(): Promise<string>
```

#### getUrlVariables
- ACP
```javascript
ACPIdentity.getUrlVariables(): Promise<?string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#geturlvariables)
```typescript
Identity.getUrlVariables(): Promise<string>
```
 
#### getIdentifiers
- ACP
```javascript
ACPIdentity.getIdentifiers(): Promise<Array<?ACPVisitorID>> 
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getidentifiers)
```typescript
Identity.getIdentifiers(): Promise<Array<VisitorID>>
```

#### getExperienceCloudId
- ACP
```javascript
ACPIdentity.getExperienceCloudId(): Promise<?string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#getexperiencecloudid)
```typescript
Identity.getExperienceCloudId(): Promise<string>
```


#### syncIdentifier
- ACP
```javascript
ACPIdentity.syncIdentifier(identifierType: String, identifier: String, authenticationState: string)
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#syncidentifier)
```typescript
Identity.syncIdentifier(identifierType: String, identifier: String, authenticationState: MobileVisitorAuthenticationState) 
```

#### syncIdentifiers
- ACP
```javascript
ACPIdentity.syncIdentifiers(identifiers?: { string: string })
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#syncidentifiers)
```typescript
Identity.syncIdentifiers(identifiers?: Record<string, string>)
```

#### syncIdentifiersWithAuthState
- ACP
```javascript
ACPIdentity.syncIdentifiersWithAuthState(identifiers?: { string: string }, authenticationState: string) 
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#syncidentifierswithauthstate)
```typescript
Identity.syncIdentifiersWithAuthState(identifiers: Record<string, string> | null, authenticationState: MobileVisitorAuthenticationState)
```


#### setAdvertisingIdentifier
- ACP
```javascript
ACPCore.setAdvertisingIdentifier(advertisingIdentifier?: String)
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#setadvertisingidentifier)
```typescript
MobileCore.setAdvertisingIdentifier(advertisingIdentifier?: string)
```

#### setPushIdentifier
- ACP
```javascript
ACPCore.setPushIdentifier(pushIdentifier?: String) 
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#setpushidentifier)
```typescript
MobileCore.setPushIdentifier(pushIdentifier?: string) 
```

### Lifecycle

#### extensionVersion
- ACP
```javascript
ACPLifecycle.extensionVersion(): Promise<string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#extensionversion-2)
```typescript
Lifecycle.extensionVersion(): Promise<string>
```

### Signal

#### extensionVersion
- ACP
```javascript
ACPSignal.extensionVersion(): Promise<string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#extensionversion-3)
```typescript
Signal.extensionVersion(): Promise<string>
```

### UserProfile

#### extensionVersion
- ACP
```javascript
ACPUserProfile.extensionVersion(): Promise<string>
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/userprofile/README.md#extensionversion)
```typescript
UserProfile.extensionVersion(): Promise<string>
```

#### removeUserAttributes
- ACP
```javascript
ACPUserProfile.removeUserAttribute(attributeName: string)
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/userprofile/README.md#removeuserattributes)
```typescript
UserProfile.removeUserAttributes(attributeNames: Array<string>)
```

#### updateUserAttributes
- ACP
```javascript
ACPUserProfile.updateUserAttributes(attributeMap: { string: any })
```
```javascript
ACPUserProfile.updateUserAttribute(attributeName: string, attributeValue: string)
```
- [AEP](https://github.com/adobe/aepsdk-react-native/tree/main/packages/userprofile/README.md#updateuserattributes)
```typescript
UserProfile.updateUserAttributes(attributeMap: Record<string, any>)
```