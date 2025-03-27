# Welcome to the Expo AEPSample App with New Architecture Enabled

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
Before running the example app, ensure your environment meets the following requirements. These prerequisites are specific to the example app:

- Familiarity with [React Native development environment setup](https://reactnative.dev/docs/environment-setup) is recommended.
- **Cocoapods**: [Version 1.11.3 or higher](https://guides.cocoapods.org/using/getting-started.html).
- **Android Studio**: Requires version 2024.2.1 Patch 1 (Ladybug) or higher.
- **Xcode**: Requires version 16.1 (16B40) or higher.
- **Node.js**: [Version 18 or higher](https://nodejs.org/en/download/).
- **React Native**: [Tested with version 0.75.x](https://reactnative.dev/).
- **Expo**: [Tested with version 51](https://docs.expo.dev/).
- Note: The new architecture is enabled by default in this build.


## Installation
To install **AEPSampleAppNewArchEnabled App**, follow these steps:

### Install dependencies
> Note: Commands are assuming you're in the root directory of the repository.

```
yarn install && yarn sampleappnewarchenabled:ios:pod:install
```

### Build packages

```
yarn run build
```

## Get Started

### Add your App Id:

In `apps/AEPSampleAppNewArchEnabled/app/layout.tsx`, locate the call to `MobileCore.initializeWithAppId(appId:"YOUR_APP_ID")` and replace `"YOUR_APP_ID"` with your property App Id.

> **Note**: The App ID should be configured in a mobile property in the Data Collection UI, in Tags. Refer to [Adobe documentation](https://developer.adobe.com/client-sdks/home/base/mobile-core/configuration/#configure-with-app-id-per-environment) for more information.

## Run Instructions

### Run Instructions for iOS  

1. **Run Using Yarn**  
   Ensure you are in the root directory of the project and execute the following command:  
   ```bash
   yarn sampleappnewarchenabled:ios:run
   ```

2. **Run the iOS App from Xcode**  
   Alternatively, follow these steps to run the app using Xcode:  
   - Start the Expo server by running the following command in the terminal:  
     ```bash
     cd apps/AEPSampleAppNewArchEnabled
     npx expo start
     ```
   - Navigate to the iOS directory:  
     ```bash
     cd ios
     ```
   - Open the Xcode workspace:  
     ```bash
     open AEPSampleAppNewArchEnabled.xcworkspace
     ```
   - Once Xcode opens, build and run the app on your desired simulator or device.

### Run Instructions for Android  

1. **Run Using Yarn**  
   Ensure an Android emulator is running or a physical device is connected. For guidance, refer to the [Android Emulator Command Line Documentation](https://developer.android.com/studio/run/emulator-commandline). Then, execute the following command from the root directory:  
   ```bash
   yarn sampleappnewarchenabled:android:run
   ```

2. **Run the Android App from Android Studio**  
   Alternatively, follow these steps to run the app using Android Studio:  
   - Start the Expo server by running the following command in the terminal:  
     ```bash
     cd apps/AEPSampleAppNewArchEnabled
     npx expo start
     ```
   - Navigate to the `android` directory:  
     ```bash
     cd android
     ```
   - Open the project in Android Studio by launching `build.gradle` located in the `apps/AEPSampleAppNewArchEnabled/android` directory.  
   - Once Android Studio opens, build and run the app on your connected device or emulator.
   
## Validate with Assurance
Assurance is integrated into the sample app for event and flow validation.

1. Create an [Assurance Session](https://experienceleague.adobe.com/docs/experience-platform/assurance/tutorials/using-assurance.html#create-sessions).
2. Copy the session link from the `Copy Link` button in the Assurance Session Details window.
3. Paste the link into the AEPSampleAppNewArchEnabled -> AssuranceView and start the session.


Thank you for using **Expo AEPSample App with New Architecture Enabled**! Feel free to star this repository and provide feedback!

