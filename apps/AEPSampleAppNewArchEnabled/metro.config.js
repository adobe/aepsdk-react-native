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
};

module.exports = config;
