# Error: pod install fails — `react_native_pods.rb` not found

## Symptom

```
[!] Invalid `Podfile` file: [!] /path/to/node -p require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  ) /path/to/apps/AEPSampleApp/ios

Error: Cannot find module 'react-native/scripts/react_native_pods.rb'
```

## Cause

`apps/AEPSampleApp` is **not** listed in the root `package.json` workspaces:

```json
"workspaces": {
  "packages": [
    "packages/*",
    "apps/AEPSampleAppNewArchEnabled",
    "apps/AwesomeProject",
    "e2e"
  ]
}
```

Running `yarn install` from the monorepo root skips `AEPSampleApp` entirely. `react-native` (and all other deps) never get installed into `apps/AEPSampleApp/node_modules/`. The Podfile resolves `react_native_pods.rb` via Node at pod install time, so it fails immediately.

## Fix

Install dependencies inside the app before running pod install:

```bash
cd apps/AEPSampleApp
yarn install

# Then from monorepo root:
cd /path/to/aepsdk-react-native
npm run sampleapp:ios:pod:install
```

## Rule

Whenever you see a `Cannot find module` error from the Podfile, the first thing to check is whether `apps/AEPSampleApp/node_modules` exists. If not, run `yarn install` inside `apps/AEPSampleApp` first.
