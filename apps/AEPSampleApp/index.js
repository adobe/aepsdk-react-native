/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { AppRegistry, NativeModules } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Routes JS console.log through native NSLogger in release builds so JS logs
// remain visible in native log capture tools on iOS 26.5+/RN 0.85+ where JS
// logs no longer surface in com.facebook.react.log. Required for /ajo-mob-smoke-test
// to capture JS SDK callbacks (e.g. CloudID, Identities) when running on release builds.
if (!__DEV__) {
  const { NSLogger } = NativeModules;
  if (NSLogger) {
    console.log = (...args) => NSLogger.log(args.map(String).join(' '));
  }
}

AppRegistry.registerComponent(appName, () => App);
