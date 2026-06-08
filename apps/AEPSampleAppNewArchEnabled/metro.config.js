const { getDefaultConfig } = require('expo/metro-config');
const { resolve, join } = require('path');

const projectRoot = __dirname;
const monorepoRoot = resolve(projectRoot, '../..');

const ADOBE_PACKAGE_FOLDERS = [
  'assurance',
  'campaignclassic',
  'core',
  'edge',
  'edgebridge',
  'edgeconsent',
  'edgeidentity',
  'messaging',
  'optimize',
  'places',
  'target',
  'userprofile',
];

const extraNodeModules = Object.fromEntries(
  ADOBE_PACKAGE_FOLDERS.map((folder) => [
    `@adobe/react-native-aep${folder}`,
    join(monorepoRoot, 'packages', folder),
  ]),
);

const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  resolve(monorepoRoot, 'packages'),
  resolve(monorepoRoot, 'node_modules'),
];

// After merging main, root node_modules gained react-native@0.85 (devDep for jest).
// This app uses react-native@0.81 (Expo 54). Block root's react-native so Metro
// always resolves it from the app's own node_modules instead.
// Escape special regex chars in absolute paths used for blockList patterns.
const escapePath = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Block root node_modules react-native/react (root devDeps for Jest) so Metro
// always uses the app's own Expo-managed versions.
// Block expo-router's nested @react-navigation so only ONE copy (the app's
// top-level versions) is bundled — prevents "multiple NavigationContainer" crash.
config.resolver.blockList = [
  new RegExp(`^${escapePath(resolve(monorepoRoot, 'node_modules/react-native'))}/.*`),
  new RegExp(`^${escapePath(resolve(monorepoRoot, 'node_modules/react'))}/.*`),
  new RegExp(`^${escapePath(join(projectRoot, 'node_modules/expo-router/node_modules/@react-navigation'))}/.*`),
];

config.resolver.nodeModulesPaths = [
  resolve(projectRoot, 'node_modules'),
  resolve(monorepoRoot, 'node_modules'),
];

// Watchman's daemon socket is unavailable in this sandboxed environment, which
// makes `watch-project` hang indefinitely. Fall back to Metro's Node-based
// file watcher so bundling can proceed.
config.resolver.useWatchman = false;

config.resolver.extraNodeModules = {
  ...extraNodeModules,
  '@babel/runtime': join(monorepoRoot, 'node_modules/@babel/runtime'),
  // Pin singleton packages to the app's own node_modules so there is never more
  // than one copy in the bundle.
  //
  // react / react-native: blocked from root node_modules (root has 0.85 devDep
  //   for Jest while this app uses 0.81 via Expo 54).
  //
  // @react-navigation/*: expo-router ships its own older nested copies
  //   (@react-navigation/core@7.14 vs app's 7.17, native@7.1.28 vs 7.2.2).
  //   Pinning here + blockList above forces a single instance → fixes
  //   "Couldn't register the navigator / multiple copies" crash.
  'react-native': join(projectRoot, 'node_modules/react-native'),
  'react': join(projectRoot, 'node_modules/react'),
  '@react-navigation/core': join(projectRoot, 'node_modules/@react-navigation/core'),
  '@react-navigation/native': join(projectRoot, 'node_modules/@react-navigation/native'),
  '@react-navigation/routers': join(projectRoot, 'node_modules/@react-navigation/routers'),
  '@react-navigation/elements': join(projectRoot, 'node_modules/@react-navigation/elements'),
};

module.exports = config;
