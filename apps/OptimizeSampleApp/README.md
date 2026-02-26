# Optimize Sample App

A **bare React Native** sample app that integrates **only** the AEP Optimize module (and its required peer dependencies: Core, Edge, Edge Identity).

Use this app to test or develop the `@adobe/react-native-aepoptimize` package in isolation.

## Dependencies

- **@adobe/react-native-aepcore** (required)
- **@adobe/react-native-aepedge**
- **@adobe/react-native-aepedgeidentity**
- **@adobe/react-native-aepoptimize**

All AEP packages are linked from the monorepo via `file:../../packages/...` and resolved by Metro from `../../packages`.

## Setup

From the **repo root**, install and run:

```sh
# Install dependencies (from app directory; use env to allow lockfile update)
cd apps/OptimizeSampleApp
YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install

# iOS: install pods
cd ios && pod install && cd ..

# Start Metro (from apps/OptimizeSampleApp)
yarn start
```

In another terminal:

```sh
cd apps/OptimizeSampleApp
yarn ios     # or yarn android
```

## Configuration

1. Replace `YOUR-APP-ID` in `App.tsx` with your [Adobe Mobile Services App ID](https://developer.adobe.com/client-sdks/documentation/) for the SDK to initialize correctly.
2. The app shows the Optimize extension version on launch when initialization succeeds.

## New Architecture

iOS is configured with **New Architecture (Turbo Modules)** enabled (`RCT_NEW_ARCH_ENABLED=1` in the Podfile).
