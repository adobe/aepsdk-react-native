const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Exclude problematic nested node_modules to prevent the bundling error
config.resolver.blockList = [
  // Block nested node_modules inside packages
  /packages\/.*\/node_modules\/.*/,
  // Block any nested node_modules directories  
  /.*\/node_modules\/.*\/node_modules\/.*/,
];

// Don't try to transpile react-native's internal source files
config.resolver.disableHierarchicalLookup = true;
// Use a separate cache for the monorepo to avoid conflicts
config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, 'node_modules', '.cache', 'metro'),
  }),
];

// Explicitly map workspace packages to their built versions
config.resolver.alias = {
  '@adobe/react-native-aepassurance': path.resolve(monorepoRoot, 'packages/assurance'),
  '@adobe/react-native-aepcampaignclassic': path.resolve(monorepoRoot, 'packages/campaignclassic'),
  '@adobe/react-native-aepcore': path.resolve(monorepoRoot, 'packages/core'),
  '@adobe/react-native-aepedge': path.resolve(monorepoRoot, 'packages/edge'),
  '@adobe/react-native-aepedgebridge': path.resolve(monorepoRoot, 'packages/edgebridge'),
  '@adobe/react-native-aepedgeconsent': path.resolve(monorepoRoot, 'packages/edgeconsent'),
  '@adobe/react-native-aepedgeidentity': path.resolve(monorepoRoot, 'packages/edgeidentity'),
  '@adobe/react-native-aepmessaging': path.resolve(monorepoRoot, 'packages/messaging'),
  '@adobe/react-native-aepoptimize': path.resolve(monorepoRoot, 'packages/optimize'),
  '@adobe/react-native-aepplaces': path.resolve(monorepoRoot, 'packages/places'),
  '@adobe/react-native-aeptarget': path.resolve(monorepoRoot, 'packages/target'),
  '@adobe/react-native-aepuserprofile': path.resolve(monorepoRoot, 'packages/userprofile'),
};

module.exports = config;