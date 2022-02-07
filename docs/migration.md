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
| @adobe/react-native-aepassurance:2.x (compatible with ACP libraries) | @adobe/@adobe/react-native-aepassurance:3.x (compatible with AEP libraries)|

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
    MobileCore.setWrapperType(WrapperType.REACT_NATIVE);

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
            MobileCore.configureWithAppID("<your_environment_id_from_Launch>");
         }
      });
    } catch (InvalidInitException e) {
      ...
    }
  }
}
```

### iOS

```objectivec
#import "ACPCore.h"
#import "ACPUserProfile.h"
#import "ACPIdentity.h"
#import "ACPLifecycle.h"
#import "ACPSignal.h"
...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [ACPCore setLogLevel:ACPMobileLogLevelDebug];
    [ACPCore configureWithAppId:@"<your_environment_id_from_Launch>"];
    [ACPUserProfile registerExtension];
    [ACPIdentity registerExtension];
    [ACPLifecycle registerExtension];
    [ACPSignal registerExtension];
    
    // remove unsupported native extensions
    
    //[ACPAnalytics registerExtension];
    //[ACPCampaign registerExtension];
    //[ACPTarget registerExtension];

    const UIApplicationState appState = application.applicationState;
    [ACPCore start:^{
      if (appState != UIApplicationStateBackground) {
        [ACPCore lifecycleStart:nil];
      }
    }];
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
```javascript
MobileCore.collectPii(data: [String : String])
```
#### updateConfiguration
- ACP (2.x)
```javascript
ACPCore.updateConfiguration(configMap?: { string: any })
```
- [AEP (1.x)](https://github.com/adobe/aepsdk-react-native/tree/main/packages/core#updating-the-sdk-configuration)
```javascript
MobileCore.updateConfiguration(configMap?: { string: any })
```
#### extensionVersion
- ACP (2.x)
```javascript

```
- AEP (1.x)
```javascript

``` 

### UserProfile
