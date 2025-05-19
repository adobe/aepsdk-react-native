# Integrating the SDK with Expo projects
The Adobe Experience Platform Mobile SDK for React Native is compatible with the latest stable version of Expo. Using the most recent version of Expo is recommended to avoid any issues.
- [Guide for Expo apps](#guide-for-expo-apps)
- [Guide for bare React Native apps using Expo modules](#guide-for-bare-react-native-apps-using-expo-modules)

# Guide for Expo apps

## Overview
With the release of the simplification SDK support, Expo projects now support Continuous Native Generation (CNG) without requiring native code modifications. The SDK extensions are now registered through Mobile Core's initialize API, eliminating the need to disable CNG or manually manage native directories.

## Installation

### Prerequisites
To prevent C++ module import errors during the iOS build process, we need to configure useFrameworks: "static" using the expo-build-properties package. This is a required step for proper Adobe SDK integration with Expo.

#### Install the required package:
```bash
npx expo install expo-build-properties
```

#### Configuration
Add the following plugin configuration to your `app.json` or `app.config.json`:
```json
{
  "plugins": [
    [
      "expo-build-properties", 
      {
        "ios": {
          "useFrameworks": "static"
        }
      }
    ]
  ]
}
```

**Important**: The `useFrameworks: "static"` setting is required for iOS to prevent C++ module import errors during the build process.

### Install Adobe Mobile SDKs

> [!NOTE]
> To support Expo CNG and use Mobile Core's initialize API (simplification SDK support), All aep sdks should have 7.x versions except places should have 7.0.1 version or higher.

After configuring the build properties, refer to the [Installation Guide](../README.md#Installation) to install Adobe SDKs.

### Initialize Adobe Mobile SDKs
Extensions are now registered through Mobile Core's initialize API (no native code required). Refer to the [Initialization Guide](../README.md#initializing) to initialize Adobe SDKs.

### Generate and Run Native Projects

To apply these build properties and include the installed SDKs in your native projects, run:
```bash
npx expo prebuild
```

This will generate the native iOS and Android projects with the configured build properties and SDKs.

After generating the native projects, you can build and run the app:

```bash
# Build and run on Android
npx expo run:android
# Build and run on iOS
npx expo run:ios
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
Extensions are now registered through Mobile Core's initialize API (no native code required). Refer to the [Initialization Guide](../README.md#initializing) to initialize Adobe SDKs.

# Troubleshooting and Known Issues
## iOS Build Issues (Legacy)
The following issues are automatically resolved when using the `expo-build-properties` plugin with `useFrameworks: "static"`  as described in the [Prerequisites](../README.md#prerequisites) section:

### 1. `Import of C++ module` error when building on iOS
**Note**: This error is automatically resolved with the static frameworks configuration.

For legacy projects not using the recommended configuration, the error appears as:
```xcode
error: import of C++ module 'Foundation' appears within extern "C" language linkage specification [-Wmodule-import-in-extern-c]
```
**Legacy Fix**: In XCode, select your app target, go to **Build Settings** and under `Apple CLang - Custom Compiler Flags`, locate `Other C++ Flags`, and add:
```bash
-Wno-module-import-in-extern-c
```
<img width="936" alt="Xcode Screenshot" src="./resources/xcode c++ flag screenshot.png">

### 2. `Use of undeclared identifier 'AEPMobileCore'` error when building on iOS
**Note**: This error is automatically resolved with the static frameworks configuration.

For legacy projects, refer to the solution [here](https://github.com/adobe/aepsdk-react-native/issues/346#issuecomment-2109949661).

## Other known issues with React Native
Refer to [Troubleshooting and Known Issues](../README.md#troubleshooting-and-known-issues) for other known issues with React Native integration.
