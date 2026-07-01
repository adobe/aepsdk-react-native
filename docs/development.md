# Development


## Requirements

- Xcode 15.0 (or newer), to submit iOS apps to the App Store, the user must build them using Xcode 15 or later
- Swift 5.1 (or newer)
- Android Studio
- Node.js 16 TLS (or newer)
- React Native >= v0.60
- Yarn

## Install dependencies 

Run `yarn install` to install the npm dependencies.

### Sample app lockfiles (`AEPSampleApp`, `BareSampleApp`)

Each sample app has its own `yarn.lock` and links the local Optimize package via **`portal:../../packages/optimize`** (not `file:`). The `portal:` protocol symlinks to the monorepo package **without** a volatile content hash/checksum, so `yarn install --immutable` stays stable across macOS/Linux CI and local `dist/` build output.

After changing `packages/optimize/`:

```bash
yarn install
yarn run build
cd apps/AEPSampleApp && yarn install    # repeat for BareSampleApp if needed
git add apps/AEPSampleApp/yarn.lock apps/BareSampleApp/yarn.lock
```

CI runs `yarn run build` before sample-app `yarn install --immutable` so native/metro consumers see compiled `dist/` output.

## Tests

To run the (Jest) unit tests locally:

Browser to the root folder of `aepsdk-react-native`

```
yarn test
```
> The `setupFiles` to configure or set up the (Jest) testing environment is located in [tests/jest/setup.js](../tests/jest/setup.js)

> Jest expects to find test files in the sub-packages' `__test__` folder.

## Optimize extension — manual validation (sample apps)

Beyond Jest, Optimize is validated on devices/simulators through **BareSampleApp** (RN 0.76, old + new architecture) and **AEPSampleApp** (RN 0.85, new architecture only). Each app ships `scripts/build-matrix.sh` to build turbo vs bridge cells without hand-editing native config. On iOS new arch, `USE_INTEROP_ROOT` is compile parity only (same SpecBase turbo binary); Android new arch still switches bridge vs turbo at runtime.

| App | Matrix entry | Docs |
| :--- | :--- | :--- |
| BareSampleApp | `cd apps/BareSampleApp && yarn build:matrix:list` | [README](../apps/BareSampleApp/README.md#optimize-extension-and-build-matrix) |
| AEPSampleApp | `cd apps/AEPSampleApp && yarn build:matrix:list` | [README](../apps/AEPSampleApp/README.md#optimize-extension-and-build-matrix) |

June 2026 smoke matrix: **10** cells (platform × arch × turbo/interop), **8** scenarios per cell, **80/80** pass. Summary in [packages/optimize/README.md](../packages/optimize/README.md#validation-matrix-june-2026). UI triggers live in each app's `extensions/OptimizeView.tsx`.

## Convention

Due to the [symlinks not working in React Native](https://github.com/facebook/metro/issues/1) issue, the solution (used in this project) is to modify [metro.config.js](../apps/AEPSampleApp/metro.config.js) to manually follow symbolic links:

```javascript
watchFolders: [
    resolve(__dirname, '../../packages'),
  ],
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (typeof name !== 'string') {
            return target[name];
          }
          if (
            name &&
            name.startsWith &&
            name.startsWith('@adobe/react-native-aep')
          ) {
            const packageName = name.replace('@adobe/react-native-aep', '');
            return join(__dirname, `../../packages/${packageName}`);
          }
          return join(__dirname, `node_modules/${name}`);
        },
      },
    ),
  },
```
So, the package in `packages` directory should exactly match the extension name, for example:
- `@adobe/react-native-aepcore`        - core
- `@adobe/react-native-aepuserprofile` - userprofile
