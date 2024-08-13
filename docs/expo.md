## Guide for apps created using the Expo CLI

### Overview
Expo projects can use both third-party React Native libraries with native code and your own custom native code. Creating a development build allows you to include your specific native dependencies and customisations.

- Initializing the SDKs should be done in native code inside your AppDelegate (iOS) and MainApplication (Android). 

- By default, Expo projects use Continuous Native Generation (CNG). This means that projects do not have android and ios directories containing the native code and configuration. You can opt out of CNG and directly manage the code and configuration inside your android and ios directories.

### Installation

- To generate these directories, run `npx expo prebuild` or compile your app locally (`npx expo run android` or `npx expo run ios`).

```bash
# Build your native Android project
npx expo run:android
# Build your native iOS project
npx expo run:ios
```

Follow the [Installation Guide](../README.md#Installation) to install Adobe SDKs once the the android and ios directories are generated.

## Guide for React Native Apps to integrate Expo Modules

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

Follow the [Installation Guide](../README.md#Installation) to install Adobe SDKs.

### Troubleshooting and Known Issues
1. Getting error when building on iOS
```xcode
error: import of C++ module 'Foundation' appears within extern "C" language linkage specification [-Wmodule-import-in-extern-c]
```
**Fix**: In XCode, add `-Wno-module-import-in-extern-c` to `Apple CLang - Custom Compiler Flags -> Other C++`
