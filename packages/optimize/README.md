
# React Native AEP Optimize Extension


`@adobe/react-native-aepoptimize` is a wrapper around the iOS and Android [Adobe Experience Platform Optimize Extension](https://aep-sdks.gitbook.io/docs/) to allow for integration with React Native applications.

## Prerequisites

The Adobe Experience Platform Optimize extension has the following peer dependency, which must be installed prior to installing the optimize extension:
- [Core](../core/README.md)
- [Edge](../edge/README.md)

## Installation

See [Requirements and Installation](https://github.com/adobe/aepsdk-react-native#requirements) instructions on the main page 

Download the `@adobe/react-native-aepoptimize` node package from the github pre-release and save it to a folder.
Install the `@adobe/react-native-aepoptimize` package:

```bash
cd MyReactApp
npm install {path to the node package}
```
**Podfile Setup**
The RN Optimize package depends on the AEPOptimize v1.0.0, which is not yet released. Clone AEPOptimize code from the [github repo]() in a folder.

```shell
git clone https://github.com/adobe/aepsdk-optimize-ios.git
```

Add the following pod dependency in your iOS project Podfile under the application target.

```
target 'MyReactApp' do  
pod 'AEPOptimize', :path => '{path to folder where AEPOptimize code was cloned}'
end
```

**Gradle setup**

In the Android project of RN application add the following under allProjects -> repositories

```groovy
flatDir {
dirs project(':adobe_react-native-aepmessaging').file('libs')
}
```

## Usage

### Initializing and registering the extension

Initialization of the SDK should be done in native code, documentation on how to initialize the SDK can be found [here](https://github.com/adobe/aepsdk-react-native#initializing).

Example:  

iOS  
```objectivec
@import AEPCore;
@import AEPLifecycle;
@import AEPEdge;
@import AEPOptimize;

@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelTrace];
  [AEPMobileCore registerExtensions: @[AEPMobileEdge.class, AEPMobileOptimize.class] completion:^{
    [AEPMobileCore configureWithAppId:@"yourAppID"];
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
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.optimize.Optimize;
  
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
    try {
      Edge.registerExtension();
      Optimize.registerExtension();
      MobileCore.configureWithAppID("yourAppID");
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

### Importing the extension:

```javascript
import { AEPOptimize, Offer, Proposition, DecisionScope } from '@adobe/react-native-aepoptimize';
```

## API reference

##### Getting the SDK version:

**Syntax**
```javascript
extensionVersion(): Promise<string>
```

**Example**
```javascript
AEPOptimize.extensionVersion().then(newVersion => console.log("AdobeExperienceSDK: AEPOptimize version: " + newVersion);
```
##### Adding onPropositionUpdate callback:
Callback that will be called with the updated Propositions.

**Syntax**
```javascript
onPropositionUpdate(adobeCallback: AdobeCallback)
```

**Example**
```javascript
AEPOptimize.onPropositionUpdate({
  call(proposition: Map<String, typeof Proposition>) {
    //App logic using the updated proposition
  }
});        
```

##### Clearing the cached Propositions:

**Syntax**
```javascript
clearCachedPropositions()
```

**Example**
```javascript
AEPOptimize.clearCachedPropositions();
```

##### getting the cached propositions:
This API returns the cached propositions for the provided DecisionScopes from the in-memory Proposition cache.

**Syntax**
```javascript
getPropositions(decisionScopes: Array<DecisionScope>): Promise<Map<string, Proposition>>
```

**Example**
```javascript
const decisionScopeText = new DecisionScope("{DecisionScope name}");
const decisionScopeImage = new DecisionScope("{DecisionScope name}");
const decisionScopeHtml = new DecisionScope("{DecisionScope name{");
const decisionScopeJson = new DecisionScope("{DecisionScope name}");
const decisionScopes = [ decisionScopeText, decisionScopeImage, decisionScopeHtml, decisionScopeJson ];

AEPOptimize.getPropositions(decisionScopes).then(
   (propositions: Map<string, typeof Proposition>) => {
      //Your app logic using the propositions
});
```

##### updating the propositions:
This API fetches the propositions for the provided DecisionScope list.

**Syntax**
```javascript
updatePropositions(decisionScopes: Array<DecisionScope>, xdm: ?Map<string, any>, data: ?Map<string, any>)
```

**Example**
```javascript
const decisionScopeText = new DecisionScope("{DecisionScope name}");
const decisionScopeImage = new DecisionScope("{DecisionScope name}");
const decisionScopeHtml = new DecisionScope("{DecisionScope name{");
const decisionScopeJson = new DecisionScope("{DecisionScope name}");
const decisionScopes = [ decisionScopeText, decisionScopeImage, decisionScopeHtml, decisionScopeJson ];

AEPOptimize.updatePropositions(decisionScopes, null, null);
```
