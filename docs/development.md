# Development


## Requirements

- Xcode 12.0 (or newer)
- Swift 5.1 (or newer)
- Android Studio
- Node.js 12 TLS (or newer)
- React Native >= v0.60
- Yarn

## Install dependencies 

Run `yarn bootstrap` to install the npm dependencies.

## Tests

This project contains jest unit tests which are contained in the `__tests__` directory, to run the tests locally:

To run the (Jest) unit tests locally:

```
yarn tests:jest
```
> The `setupFiles` to configure or set up the (Jest) testing environment is located in [tests/jest/setup.js](../tests/jest/setup.js)

> Jest expects to find test files in the sub-packages' `__test__` folder.

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
