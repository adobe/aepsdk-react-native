# Integrating the SDK with Expo projects

The Adobe Experience Platform Mobile SDK for React Native is compatible with the latest stable version of Expo. Using the most recent version of Expo is recommended to avoid any issues.

- [Guide for Expo apps](#guide-for-expo-apps)
- [Guide for bare React Native apps using Expo modules](#guide-for-bare-react-native-apps-using-expo-modules)

# Guide for Expo apps

## Overview
Expo projects can use both third-party React Native libraries with native code and custom native code. Creating a development build with Expo CLI allows inclusion of specific native dependencies and customizations.

Initializing the Adobe Mobile SDK requires native code implementation. In Expo projects, Continuous Native Generation (CNG) is enabled by default, meaning the `Android` and `iOS` directories for native code and configuration are not included. To integrate the Mobile SDK, CNG must be disabled, and the `Android` and `iOS` directories must be generated and managed manually.

## Installation

To generate these directories, run 
```bash
npx expo prebuild
```
Alternatively, compile the app locally:
```bash
# Build your native Android project
npx expo run:android
# Build your native iOS project
npx expo run:ios
```

## Install Adobe Mobile SDKs

Refer to the [Installation Guide](../README.md#Installation) to install Adobe SDKs after the android and ios directories are generated.

## Initialize Adobe Mobile SDKs
Initializing the Mobile SDK involves implementing native code. The following code snippets show how to install and register the Mobile Core and Edge Network extensions. Documentation on how to initialize each extension can be found in _./packages/{extension}/README.md_.

##### **iOS**

Create a separate header and Objective-C file to handle the Adobe SDK setup, then import this file into the `AppDelegate` to initialize the SDK when the app launches.

AdobeBridge.h
```objective-c
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
@interface AdobeBridge : NSObject
+ (void)configure: (UIApplicationState)state;
@end
```

AdobeBridge.m
```objective-c
#import "AdobeBridge.h"
#import <UIKit/UIKit.h>
@import AEPCore;
@import AEPEdgeIdentity;
@import AEPEdgeConsent;
@import AEPEdge;
@import AEPIdentity;
@implementation AdobeBridge
+ (void)configure: (UIApplicationState)appState
{
  [AEPMobileCore setLogLevel: AEPLogLevelDebug];
  NSArray *extensionsToRegister = @[
      AEPMobileEdgeIdentity.class,
      AEPMobileEdgeConsent.class,
      AEPMobileAssurance.class,
      AEPMobileEdge.class,
      AEPMobileIdentity.class,
      AEPMobileLifecycle.class,
      AEPMobileOptimize.class,
      AEPMobileSignal.class,
      AEPMobileUserProfile.class
      ];
      [AEPMobileCore registerExtensions:extensionsToRegister completion:^{
        [AEPMobileCore configureWithAppId: @"KEY"];
        if (appState != UIApplicationStateBackground) {
            [AEPMobileCore lifecycleStart:@{@"": @""}];
        }
    }];
}
@end
```

AppDelegate.mm
```objective-c
#import "AdobeBridge.h" // add this import
...
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  ...
  [AdobeBridge configure: application.applicationState]; // Add this line
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```

> [!TIP]
> If the following build error occurs when running the iOS application after Mobile SDK installation:
>
> ```
> ld: warning: Could not find or use auto-linked library 'swiftCoreFoundation'
> ```
>
> This is because the Mobile SDK now requires the app to use Swift interfaces. Adding a placeholder `.swift` file to the project embeds the Swift standard libraries. See the SampleApp in this repository for an example.

##### **Android:** _(Kotlin)_

```kotlin
// MainApplication.kt
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Edge;
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

# Guide for bare React Native apps using Expo modules

## Overview
Bare React Native workflows can be integrated with Expo SDKs by using the `install-expo-modules` command. This allows you to use Expo modules in your app.

To use Expo modules in an app, installation and configuration of the `expo` package is required. The `expo` package has a small footprint; it includes only a minimal set of packages needed in nearly every app and the module and autolinking infrastructure that other Expo SDK packages are built with. After the `expo` package is installed and configured in the project, `npx expo install` can be used to add any other Expo module from the SDK.


## Installation
- To install and use Expo modules, the easiest way to get up and running is with the `install-expo-modules` command.
```bash
npx install-expo-modules@latest
```
- If the command fails, please follow the manual installation [instructions](https://docs.expo.dev/bare/installing-expo-modules/#manual-installation).

## Install Adobe Mobile SDKs

Refer to the [Installation Guide](../README.md#Installation) to install Adobe SDKs.

## Initialize Adobe Mobile SDKs

Refer to the [Initialization Guide](../README.md#initializing) to initialize Adobe SDKs.

# Troubleshooting and Known Issues
1. `Import of C++ module` error when building on iOS

When facing the following error:
```xcode
error: import of C++ module 'Foundation' appears within extern "C" language linkage specification [-Wmodule-import-in-extern-c]
```
**Fix**: In XCode, select your app target, go to **Build Settings** and under `Apple CLang - Custom Compiler Flags`, locate `Other C++ Flags`, and add:
```bash
-Wno-module-import-in-extern-c
```
<img width="936" alt="Xcode Screenshot" src="./resources/xcode c++ flag screenshot.png">

2. `Use of undeclared identifier 'AEPMobileCore'` error when building on iOS

When facing the following error:
```xcode
error: Use of undeclared identifier 'AEPMobileCore'
```
Refer to the solution [here](https://github.com/adobe/aepsdk-react-native/issues/346#issuecomment-2109949661).

## Other known issues with React Native
Refer to [Troubleshooting and Known Issues](../README.md#troubleshooting-and-known-issues) for other known issues with React Native integration.