# AEPSampleApp

> Note: Commands are assuming you're in the root directory of the repository.

> Note: If you are new to React Native we suggest you follow the [React Native Getting Started](<https://facebook.github.io/react-native/docs/getting-started.html>) page before continuing.

How to run the sample app:

### Add your App Id:
In `ios/**/AppDelegate.mm`, find the call to `configureWithAppId` and add your app id.

In `android/**/MainApplication.java`, find the call to `configureWithAppId` and add your app id.

#### Install dependecies 

```
yarn bootstrap && yarn sampleapp:ios:pod:install
```

#### Run instructions for iOS:

```
yarn sampleapp:ios:run
```

#### Run instructions for Android:

Have an Android emulator running (quickest way to get started), or a device connected. https://developer.android.com/studio/run/emulator-commandline

```
yarn sampleapp:android:run
```
