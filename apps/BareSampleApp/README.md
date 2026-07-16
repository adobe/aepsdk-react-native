# BareSampleApp

## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Get Started](#how-to-run-the-sample-app)
- [Optimize extension and build matrix](#optimize-extension-and-build-matrix)
- [Validate with Assurance](#validate-with-assurance)
- [Resources and Troubleshooting](#resources-and-troubleshooting)

## Introduction

BareSampleApp is a React Native **0.76** sample app used to validate Adobe SDK extensions on both **old and new architecture**, including Optimize Turbo Module vs interop paths. It mirrors AEPSampleApp feature screens under `extensions/` but stays on the RN 0.76 toolchain for backward-compatibility testing.

## Prerequisites

 * [React Native environment setup](https://reactnative.dev/docs/0.76/set-up-your-environment) for RN 0.76
 * Cocoapods version >= 1.11.3
 * Node version >= 18

## How to run the sample app:

### Add your App Id:

In `/apps/BareSampleApp/App.tsx`, locate `MobileCore.initializeWithAppId` and set your Launch property App Id.

> App id is configured in a mobile property in Data Collection UI. Refer to [configure with App ID per environment](https://developer.adobe.com/client-sdks/home/base/mobile-core/configuration/#configure-with-app-id-per-environment).

### Install dependencies

From the **repository root**:

```
yarn install && yarn bareapp:ios:pod:install
```

From **apps/BareSampleApp**:

```
yarn install
```

### Build packages

```
yarn run build
```

### Run instructions for iOS:

```
yarn bareapp:ios:run
```

Or open `apps/BareSampleApp/ios/BareSampleApp.xcworkspace` in Xcode (with Metro running via `npx react-native start`).

### Run instructions for Android:

```
yarn bareapp:android:run
```

## Optimize extension and build matrix

BareSampleApp links `@adobe/react-native-aepoptimize` from `packages/optimize`. **OptimizeView** (`extensions/OptimizeView.tsx`) exposes Optimize API flows for manual testing.

The matrix script toggles **new/old architecture** and **USE_INTEROP_ROOT**. On **Android**, the flag selects bridge vs turbo on new arch. On **iOS new arch**, both flag values compile to the same SpecBase turbo binary (row 3 is compile parity only); the only true iOS bridge path is **old arch + interop**.

```bash
cd apps/BareSampleApp
yarn build:matrix:list              # all RN 0.76 cells

# Common presets (sync deps, full clean, build, run)
yarn build:ios:old:interop          # iOS old arch + interop (only true iOS classic bridge)
yarn build:ios:new:turbo            # iOS new arch + turbo (primary new-arch iOS cell)
yarn build:ios:new:interop          # iOS new arch — USE_INTEROP_ROOT compile parity (optional)
yarn build:android:old:interop      # Android old arch + interop (primary Android 0.76 path)
yarn build:android:new:turbo        # Android new arch + Turbo Module
yarn build:android:new:interop      # Android new arch + bridge module
```

Manual invocation:

```bash
./scripts/build-matrix.sh --preset ios-new-turbo -c full --sync --run
./scripts/build-matrix.sh --platform android --arch old --interop true -c light --sync
```

> **Note:** On Android old architecture the bridge module is always used; `USE_INTEROP_ROOT=false` on old arch only changes `BuildConfig`, not the loaded Java class. On iOS new architecture, `USE_INTEROP_ROOT` does not select a different runtime path — only old arch + interop uses `RCTEventEmitter`.

## Validate with Assurance:

Assurance is integrated in the sample app.

1. Create an [Assurance Session](https://experienceleague.adobe.com/docs/experience-platform/assurance/tutorials/using-assurance.html#create-sessions).
2. Paste the session URL in BareSampleApp → AssuranceView and start the session.

## Resources and Troubleshooting

* Yarn scripts for this app are listed in [apps/BareSampleApp/package.json](./package.json) (`build:*`, `build:matrix*`).
* Extension demo UI: `apps/BareSampleApp/extensions/`.
* For RN 0.85 / new-arch-only testing, use [AEPSampleApp](../AEPSampleApp/README.md).
