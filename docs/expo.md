# Integrating the SDK with Expo projects

We ensure compatibility with the latest stable version of Expo. Please make sure you are using the most recent version of Expo to avoid any issues.

- [Guide for Expo apps](#guide-for-expo-apps)
- [Guide for Bare React Native apps using Expo modules](#guide-for-bare-react-native-apps-using-expo-modules)

## Guide for Expo apps

### Overview
Expo projects can use both third-party React Native libraries with native code and your own custom native code. Creating a development build with Expo CLI allows you to include your specific native dependencies and customizations.

When initializing the Adobe Mobile SDKs, it is required to initialize the SDKs in the native code inside your `AppDelegate` file for iOS and the `MainApplication` file for Android.

By default, Expo projects use Continuous Native Generation (CNG). This means that projects do not have android and ios directories containing the native code and configuration. You can opt out of CNG and directly manage the code and configuration inside your android and ios directories.

### Installation

To generate these directories, run 
```bash
npx expo prebuild
```
Or compile your app locally.
```bash
# Build your native Android project
npx expo run:android
# Build your native iOS project
npx expo run:ios
```

### Install Adobe Mobile SDKs

Follow the [Installation Guide](../README.md#Installation) to install Adobe SDKs once the the android and ios directories are generated.

### Initialize Adobe Mobile SDKs
Initializing the SDK should be done in native code inside your `AppDelegate` (iOS) and `MainApplication` (Android). The following code snippets demonstrate how to install and register the AEP Mobile Core and Edge Network extensions. Documentation on how to initialize each extension can be found in _./packages/{extension}/README.md_.

##### **iOS**

```objective-c
//AppDelegate.h
@import AEPCore;
@import AEPServices;
@import AEPLifecycle;
@import AEPSignal;
@import AEPEdge;
@import AEPEdgeIdentity;
@import AEPEdgeConsent;
...
```

```objective-c
//AppDelegate.m
...
@implementation AppDelegate
-(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  [AEPMobileCore configureWithAppId:@"yourAppID"];

  const UIApplicationState appState = application.applicationState;

  [AEPMobileCore registerExtensions: @[
      AEPMobileLifecycle.class,
      AEPMobileSignal.class,
      AEPMobileEdge.class,
      AEPMobileEdgeIdentity.class,
      AEPMobileEdgeConsent.class,
  ] completion:^{
    if (appState != UIApplicationStateBackground) {
       [AEPMobileCore lifecycleStart:nil}];
    }
  }];
  return YES;
}

@end

```

> To enable the Lifecycle metrics, [implement the Lifecycle APIs](./packages/core/README.md#lifecycle)

> Hint : While running iOS application after Adobe Experience Platform SDK installation. If you have build error that states:
> "ld: warning: Could not find or use auto-linked library 'swiftCoreFoundation'"
> This is because Adobe Experience Platform SDK now requires the app uses swift interfaces. Add a dummy .swift file to your project to embed the swift standard libs. See the SampleApp presented in this repo for example.

##### **Android:** _(Kotlin)_

```kotlin
// MainApplication.kt
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Extension;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.Signal;
import com.adobe.marketing.mobile.Edge;
import com.adobe.marketing.mobile.edge.consent.Consent;
```

```kotlin
class MainApplication : Application(), ReactApplication {
  ...
  override fun onCreate() {
    super.onCreate()
    ...

    MobileCore.setApplication(this)
    MobileCore.setLogLevel(LoggingMode.VERBOSE)
    MobileCore.configureWithAppID("YOUR-APP-ID")
    val extensions: List<Class<out Extension?>> = Arrays.asList(
      Lifecycle.EXTENSION,
      Signal.EXTENSION,
      Edge.EXTENSION,
      Consent.EXTENSION,
      com.adobe.marketing.mobile.Identity.EXTENSION
    )
    MobileCore.registerExtensions(extensions,
      AdobeCallback { o: Any? ->
        MobileCore.lifecycleStart(
          null
        )
      })
  }
}
```

> To enable the Lifecycle metrics, [implement the Lifecycle APIs](./packages/core/README.md#lifecycle)

## Guide for Bare React Native apps using Expo modules

### Overview
Bare React Native workflows can be integrated with Expo SDKs by using the `install-expo-modules` command. This allows you to use Expo modules in your app.
- To use Expo modules in your app, you will need to install and configure the expo package.
- The expo package has a small footprint; it includes only a minimal set of packages that are needed in nearly every app and the module and autolinking infrastructure that other Expo SDK packages are built with.
- Once the expo package is installed and configured in your project, you can use `npx expo install` to add any other Expo module from the SDK.

### Installation
- To install and use Expo modules, the easiest way to get up and running is with the `install-expo-modules` command.
```bash
npx install-expo-modules@latest
```
- If the command fails, please follow the manual installation [instructions](https://docs.expo.dev/bare/installing-expo-modules/#manual-installation).

### Install Adobe Mobile SDKs

Follow the [Installation Guide](../README.md#Installation) to install Adobe SDKs.

### Initialize Adobe Mobile SDKs

Follow the [Initialization Guide](../README.md#initializing) to initialize Adobe SDKs.

### Troubleshooting and Known Issues
1. Getting error when building on iOS
```xcode
error: import of C++ module 'Foundation' appears within extern "C" language linkage specification [-Wmodule-import-in-extern-c]
```
**Fix**: In XCode, add `-Wno-module-import-in-extern-c` to `Apple CLang - Custom Compiler Flags -> Other C++`
<img width="936" alt="Screenshot 2024-08-23 at 1 15 03 AM" src="https://github.com/user-attachments/assets/518b0e39-a2dd-4f37-94c2-c7663cb4edcd">

#### Other Known Issues with React Native
Please refer [here](../README.md#troubleshooting-and-known-issues) for other known issues with React Native integration.