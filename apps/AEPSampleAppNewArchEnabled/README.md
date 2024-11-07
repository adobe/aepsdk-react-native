# Welcome to Your Expo AEPSample App with New Architecture Enabled 👍

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Get Started](#get-started)
- [Run Instructions](#run-instructions)
  - [Run Instructions for iOS](#run-instructions-for-ios)
  - [Run Instructions for Android](#run-instructions-for-android)
- [Validate with Assurance](#validate-with-assurance)


## Introduction
Welcome to the **Expo AEPSample App with New Architecture Enabled**. This project is an [Expo](https://expo.dev) app created using [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). It demonstrates the integration of Adobe SDKs with a React Native app using Expo, with the new architecture enabled by default.

## Prerequisites
Ensure that your environment meets the following requirements before running this project:

- Familiarity with [React Native development environment setup](https://reactnative.dev/docs/environment-setup) is recommended (preferably with the React Native CLI Quickstart).
- **Cocoapods**: [Version 1.11.3 or higher](https://guides.cocoapods.org/using/getting-started.html).
- **Node.js**: [Version 18 or higher](https://nodejs.org/en/download/).
- **React Native**: [Tested with version 0.75.x](https://reactnative.dev/).
- **Expo**: [Tested with version 51](https://docs.expo.dev/).
- Note: The new architecture is enabled by default in this build.


## Installation
To install **AEPSample App**, follow these steps:

### Install dependencies
> Note: Commands are assuming you're in the root directory of the repository.

```
yarn install && yarn sampleapp:ios:pod:install
```

### Build packages

```
yarn run build
```

## Get Started

### Configure the App ID

- **iOS**: In `apps/AEPSampleAppNewArchEnabled/ios/AEPSampleAppNewArchEnabled/AdobeBridge.m`, find the `configureWithAppId` call and add your app ID.
- **Android**: In `apps/AEPSampleApp/android/app/src/main/java/com/aepsampleapp/MainApplication.kt`, find the `configureWithAppId` call and add your app ID.

> **Note**: The App ID should be configured in a mobile property in the Data Collection UI, in Tags. Refer to [Adobe documentation](https://developer.adobe.com/client-sdks/home/base/mobile-core/configuration/#configure-with-app-id-per-environment) for more information.

## Run Instructions

### Run Instructions for iOS
1. Ensure you are in the root directory.
   ```bash
   yarn sampleappnewarchenabled:ios:run
   ```

2. Alternatively, run the iOS app from Xcode:
   ```bash
   npx expo start
   ```
   Navigate to `apps/AEPSampleAppNewArchEnabled/ios` and open `AEPSampleAppNewArchEnabled.xcworkspace`:
   ```bash
   cd apps/AEPSampleAppNewArchEnabled/ios
   open AEPSampleAppNewArchEnabled.xcworkspace
   ```

### Run Instructions for Android

1. Ensure an Android emulator is running or a device is connected. For guidance, refer to [Android Emulator Command Line](https://developer.android.com/studio/run/emulator-commandline).
   ```bash
   yarn sampleappnewarchenabled:android:run
   ```

2. Alternatively, run the app from Android Studio:
   ```bash
   npx expo start
   ```
   Navigate to `apps/AEPSampleAppNewArchEnabled/android`, open `build.gradle`, and run the app in Android Studio.

## Validate with Assurance
Assurance is integrated into the sample app for event and flow validation.

1. Create an [Assurance Session](https://experienceleague.adobe.com/docs/experience-platform/assurance/tutorials/using-assurance.html#create-sessions).
2. Copy the session link from the `Copy Link` button in the Assurance Session Details window.
3. Paste the link into the AEPSampleAppNewArchEnabled -> AssuranceView and start the session.


Thank you for using **Expo AEPSample App with New Architecture Enabled**! Feel free to star this repository and provide feedback!

