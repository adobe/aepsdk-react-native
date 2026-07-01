# AEPSampleApp

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Get Started](#how-to-run-the-sample-app)
- [Optimize extension and build matrix](#optimize-extension-and-build-matrix)
- [Validate with Assurance](#validate-with-assurance)
- [Resources and Troubleshooting](#resources-and-troubleshooting)

## Introduction
This project is a React Native app set up using `react-native-cli`. It serves as a demonstrates of the integration Adobe SDKs with a React Native application.

## Prerequisites

 * If you are new to React Native we suggest you follow the older version [React Native Setting up development environment](https://reactnative.dev/docs/0.74/getting-started-without-a-framework) React Native CLI before continuing.
 * Cocoapods version >= 1.11.3
 * Node version >= 18

## How to run the sample app:

### Add your App Id:

In `/apps/AEPSampleApp/App.tsx`, locate the call to `MobileCore.initializeWithAppId(appId:"YOUR_APP_ID")` and replace `"YOUR_APP_ID"` with your property App Id.

> Note: App id is configured in a mobile property in Data Collection UI, in Tags.  Refer to [configure with App ID per environment](https://developer.adobe.com/client-sdks/home/base/mobile-core/configuration/#configure-with-app-id-per-environment) page for more information.

### Install dependencies 
Go to the **AEPSampleApp** folder and run

```
yarn install
```

Go to the **root directory** and run scripts

> Note: Commands are assuming you're in the root directory of the repository.

```
yarn install && yarn sampleapp:ios:pod:install
```

### Build packages

```
yarn run build
```

### Run instructions for iOS:

```
yarn sampleapp:ios:run
```
Alternatively, you can run the iOS app from Xcode by executing the following command in your terminal:

```
npx react-native start
```
Then navigate to apps/AEPSampleApp/ios and double click on the `AEPSampleApp.xcworkspace` file, or from the terminal:

```
cd apps/AEPSampleApp/ios
open AEPSampleApp.xcworkspace
```

### Run instructions for Android:

Have an Android emulator running (quickest way to get started), or a device connected. https://developer.android.com/studio/run/emulator-commandline

```
yarn sampleapp:android:run
```

Alternatively, you can run the Android app from Android Studio by executing the following command in your terminal

```
npx react-native start
```

Then navigate to apps/AEPSampleApp/android, double click on the `build.gradle` file, and run the app in Android Studio.

### Optimize extension and build matrix

AEPSampleApp targets **React Native 0.85** with **New Architecture enabled**. It links `@adobe/react-native-aepoptimize` from `packages/optimize` for local development and includes **OptimizeView** (`extensions/OptimizeView.tsx`) with buttons for the Optimize smoke scenarios (update propositions, listeners, display/tap offers, clear cache, and batch display).

To switch Optimize native wiring without editing Gradle/Podfiles by hand, use the build matrix script. On **Android new arch**, `USE_INTEROP_ROOT` selects bridge vs turbo. On **iOS new arch**, both flag values compile to the same SpecBase turbo binary — `ios-interop` is an optional compile-flag parity check, not a separate RN interop path.

```bash
cd apps/AEPSampleApp
yarn build:matrix:list          # list RN 0.85 cells
yarn build:ios:turbo            # iOS new arch + turbo (primary iOS cell)
yarn build:ios:interop          # iOS new arch — USE_INTEROP_ROOT compile parity (optional)
yarn build:android:turbo        # Android new arch + Turbo Module
yarn build:android:interop      # Android new arch + bridge module
yarn build:both:turbo           # both platforms, turbo on Android
```

Each `yarn build:*` preset runs `scripts/build-matrix.sh` with `--sync --run` (syncs deps, builds, starts Metro, and launches the app). For build-only:

```bash
./scripts/build-matrix.sh --preset android-turbo -c full --sync --build-only
```

**Validated cells (June 2026):** `aep-ios-new-turbo`, `aep-android-new-interop`, and `aep-android-new-turbo` — **8/8** smoke tests pass on each. `aep-ios-new-interop` is compile-flag parity with `aep-ios-new-turbo` (same SpecBase runtime). See [Optimize package README](../../packages/optimize/README.md#validation-matrix-june-2026) for the full cross-app matrix including BareSampleApp on RN 0.76.

### Validate with Assurance:

Assurance is integrated in the sample app for validating the events and flows. 

1. Create an [Assurance Session](https://experienceleague.adobe.com/docs/experience-platform/assurance/tutorials/using-assurance.html#create-sessions).
2. Copy the session link from `Copy Link` in the Assurance Session Details window. Paste it to the AEPSampleApp -> AssuranceView, then Start Session.


## Resources and Troubleshooting
* Where can we find the information about the Yarn scripts in the Sample App? <br>
  Refer to [Sample App yarn scripts](https://github.com/adobe/aepsdk-react-native/blob/main/package.json#L11).

* Where is the sample app React Native code? <br>
  All the extension TypeScript code is located under AEPSampleApp > extensions.

* I encountered errors while building the app. <br>
  Validate you have node installed, check your React Native development setup, refer to the doc under Prerequisites.

* Getting error regarding to Yoga.cpp when building the Sample App <br>
  Run below code in the Terminal:
  ```bash
   cd apps/AEPSampleApp
   sed -i.bo 's/    node->getLayout()\.hadOverflow() |$/\0|/' ./node_modules/react-native/ReactCommon/yoga/yoga/Yoga.cpp
   cd ../../
   rm -rf ~/Library/Developer/Xcode/DerivedData
  ```
* Getting this error in logcat logs when running in Android simulator: javax.net.ssl.SSLHandshakeException: Chain validation failed <br>
  Check the date and time on the simulator is current, if not, update these from the Settings menu.

* Getting error when building app in Xcode 15 RCT-Folly hash - No template named 'unary_function' in namespace std <br>
  This error may be thrown due to an incompatiblity between React Native version 0.68.x and Xcode 15. Make sure you are running with React Native 0.70 or above, if needed pull the latest updates from main branch of this repo, and run [Install dependencies](#install-dependencies) again.
  
