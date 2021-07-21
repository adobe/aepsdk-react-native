# aepsdk-react-native

[![license](https://img.shields.io/npm/l/@adobe/react-native-aepcore.svg)](./LICENSE)
[![CircleCI](https://img.shields.io/circleci/project/github/adobe/react-native-acpuserprofile/main.svg?logo=circleci)](https://circleci.com/gh/adobe/workflows/react-native-acpuserprofile) 

This repository is a monorepo. It contains a collection of AEPSDK React Native modules/packages listed below. These modules/packages can be found in the [packages](./packages) directory. 
| Package Name | Latest Version |
| ---- | ---- |
|  [@adobe/react-native-aepcore (required)](./packages/core)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-acpcore.svg)](https://www.npmjs.com/package/@adobe/react-native-acpcore) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-acpcore)](https://www.npmjs.com/package/@adobe/react-native-acpcore) |
|  [@adobe/react-native-aepuserprofile](./packages/userprofile)    |   [![npm version](https://badge.fury.io/js/%40adobe%2Freact-native-acpuserprofile.svg)](https://www.npmjs.com/package/@adobe/react-native-acpuserprofile) [![npm downloads](https://img.shields.io/npm/dm/@adobe/react-native-acpuserprofile)](https://www.npmjs.com/package/@adobe/react-native-acpuserprofile)   |


`@adobe/react-native-aep{extension}` is a wrapper around the iOS, tvOS and Android [AEP SDK](https://aep-sdks.gitbook.io/docs/) to allow for integration with React Native applications.

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

### Link

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app.


## Development

See [development.md](./docs/development.md) for development docs.


## Contributing
See [CONTRIBUTING](CONTRIBUTING.md)

## License
See [LICENSE](LICENSE)
