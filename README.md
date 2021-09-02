# aepsdk-react-native

<!--- [![license](https://img.shields.io/npm/l/@adobe/react-native-aepcore.svg)](./LICENSE) --->
[![CircleCI](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main.svg?style=svg)](https://circleci.com/gh/adobe/aepsdk-react-native/tree/main)

## BETA ACKNOWLEDGEMENT

The react native modules containing in this repository are currently in Beta. Use of this code is by invitation only and not otherwise supported by Adobe. Please contact your Adobe Customer Success Manager to learn more.

By using the Beta, you hereby acknowledge that the Beta is provided "as is" without warranty of any kind. Adobe shall have no obligation to maintain, correct, update, change, modify or otherwise support the Beta. You are advised to use caution and not to rely in any way on the correct functioning or performance of such Beta and/or accompanying materials.

## About this project

This repository is a monorepo. It contains a collection of AEPSDK React Native modules/packages listed below. These modules/packages can be found in the [packages](./packages) directory. 
| Package Name | Latest Version |
| ---- | ---- |
|  [@adobe/react-native-aepcore (required)](./packages/core)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepcore.svg)](https://www.npmjs.com/package/@adobe/react-native-aepcore) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepcore)](https://www.npmjs.com/package/@adobe/react-native-aepcore) |
|  [@adobe/react-native-aepuserprofile](./packages/userprofile)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-aepuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-aepuserprofile)](https://www.npmjs.com/package/@adobe/react-native-aepuserprofile)   |
|  [@adobe/react-native-aepassurance](./packages/assurance)    |   To be released   |


`@adobe/react-native-aep{extension}` is a wrapper around the iOS and Android [AEP SDK](https://aep-sdks.gitbook.io/docs/) to allow for integration with React Native applications.

## Requirements

- React Native >= v0.60.0

## Installation

You need to install the SDK with [npm](https://www.npmjs.com/) and configure the native Android/iOS project in your react native project.

> Note: If you are new to React Native we suggest you follow the [React Native Getting Started](<https://facebook.github.io/react-native/docs/getting-started.html>) page before continuing.

### Install npm package

> Requires `@adobe/react-native-aepcore` to be installed.

Install the `@adobe/react-native-aep{extension}` package:

```bash
cd MyReactApp
npm install @adobe/react-native-aep{extension}
```

For iOS development, after installing the plugins from npm, download the pod dependencies by running the following command:
`cd ios && pod install && cd ..`
To update native dependencies to latest available versions, run the following command:
`cd ios && pod update && cd ..`

### Link

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app.


## Development

See [development.md](./docs/development.md) for development docs.

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md)

## License
See [LICENSE](LICENSE)
