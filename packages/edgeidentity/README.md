
# React Native AEP Identiity for Edge Network Extension

[![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepedgeidentity.svg)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity) 
[![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepedgeidentity)](https://www.npmjs.com/package/@adobe/react-native-aepedgeidentity)

## Usage

### Install npm package

> Requires `@adobe/react-native-aepcore` to be installed.  - [Core](../core/README.md)

Install the `@adobe/react-native-aepedgeidentity` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aepedgeidentity
```

### Initializing:

Initializing the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

Example:

iOS
```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPEdgeIdentity;
...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:@"your-app-ID"];
  [AEPMobileCore registerExtensions: @[AEPMobileLifecycle.class, AEPMobileEdgeIdentity.class
    ] completion:^{
    [AEPMobileCore lifecycleStart:@{@"contextDataKey": @"contextDataVal"}];
  }
  ];

  return YES;
}

@end
```

Android
```java
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.InvalidInitException;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.edge.identity;
  
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
      Identity.registerExtension();
      Lifecycle.registerExtension();
      MobileCore.configureWithAppID("your-app-ID");
      MobileCore.start(new AdobeCallback() {
        @Override
        public void call(Object o) {
          MobileCore.lifecycleStart(null);
        }
      });
    } catch (InvalidInitException e) {
      ...
    }
  }
}     
```
### [Identity for Edge Network](https://aep-sdks.gitbook.io/docs/foundation-extensions/identity-for-edge-network)

#### Importing the extension:
```javascript
import {AEPIdentity} from '@adobe/react-native-aepedgeidentity';
```

#### Getting the extension version:

```javascript
AEPIdentity.extensionVersion().then(version => console.log("AdobeExperienceSDK: AEPEdgeIdentity version: " + version));
```
##### Get Experience Cloud IDs:
```javascript
AEPIdentity.getExperienceCloudId().then(cloudId => console.log("AdobeExperienceSDK: CloudID = " + cloudId));
```
