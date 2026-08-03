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

// Some workspace packages (e.g. messaging) keep their own private devDependency
// copies of react/react-native under packages/<name>/node_modules because Yarn
// can't hoist them. Metro's Node resolution finds those before the app's own
// copy, silently bundling a second react-native runtime alongside the app's —
// which breaks bridgeless/new-arch init (e.g. "MessageQueue doesn't exist").
// Block every nested node_modules under packages/*, plus root's copies and
// expo-router's nested @react-navigation, so Metro always resolves these
// singletons to the app's own node_modules instead.
// Escape special regex chars in absolute paths used for blockList patterns.
const escapePath = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

config.resolver.blockList = [
  new RegExp(`^${escapePath(resolve(monorepoRoot, 'node_modules/react-native'))}/.*`),
  new RegExp(`^${escapePath(resolve(monorepoRoot, 'node_modules/react'))}/.*`),
  new RegExp(`^${escapePath(join(projectRoot, 'node_modules/expo-router/node_modules/@react-navigation'))}/.*`),
  new RegExp(`^${escapePath(resolve(monorepoRoot, 'packages'))}/[^/]+/node_modules/.*`),
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
  // react / react-native: blocked from root and packages/*/node_modules above
  //   (some workspace packages carry their own private devDependency copies).
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
