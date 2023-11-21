# AEPSampleApp

## Prerequisites

 * If you are new to React Native we suggest you follow the [React Native Setting up development environment](https://reactnative.dev/docs/environment-setup) React Native CLI Quickstart page before continuing.
 * Cocoapods version >= 1.11.3
 * Node version >= 18

## How to run the sample app:

### Add your App Id:

In `ios/**/AppDelegate.mm`, find the call to `configureWithAppId` and add your app id.

In `android/**/MainApplication.java`, find the call to `configureWithAppId` and add your app id.

> Note: App id is configured in a mobile property in Data Collection UI, in Tags.  Refer to [configure with App ID per environment](https://developer.adobe.com/client-sdks/home/base/mobile-core/configuration/#configure-with-app-id-per-environment) page for more information.

### Install dependecies 
> Note: Commands are assuming you're in the root directory of the repository.

```
yarn install && yarn sampleapp:ios:pod:install
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
  

