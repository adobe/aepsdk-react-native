# Integrating the SDK with Expo projects

The Adobe Experience Platform Mobile SDK for React Native is compatible with the latest stable version of Expo. Using the most recent version of Expo is recommended to avoid any issues.

- [Guide for Expo apps](#guide-for-expo-apps)
- [Guide for bare React Native apps using Expo modules](#guide-for-bare-react-native-apps-using-expo-modules)

# Guide for Expo apps

> [!NOTE]
> A simplified solution for SDK integrated with Expo is currently in development and expected to be available in the next couple of months. You may proceed with the current steps or choose to wait for the updated version if you prefer a more streamlined setup.

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
Refer to the [Initialization Guide](../README.md#initializing) to initialize Adobe SDKs.


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