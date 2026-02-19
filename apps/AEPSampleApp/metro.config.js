// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://facebook.github.io/metro/docs/configuration
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);



/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 * Resolves local @adobe packages from ../../packages for the monorepo.
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const packagesDir = path.join(monorepoRoot, 'packages');
const appNodeModules = path.join(projectRoot, 'node_modules');

const adobePackages = [
  'assurance', 'campaignclassic', 'core', 'edge', 'edgebridge', 'edgeconsent',
  'edgeidentity', 'messaging', 'optimize', 'places', 'target', 'userprofile',
];

const extraNodeModules = {
  tslib: path.join(appNodeModules, 'tslib'),
};
adobePackages.forEach((name) => {
  extraNodeModules['@adobe/react-native-aep' + name] = path.join(packagesDir, name);
});

const config = {
  projectRoot,
  watchFolders: [packagesDir, monorepoRoot],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
    extraNodeModules,
    nodeModulesPaths: [appNodeModules],
    // Force @adobe packages to resolve to packagesDir so Metro finds them in the monorepo
    resolveRequest: (context, moduleName, platform) => {
      const match = moduleName.match(/^@adobe\/react-native-aep(\w+)$/);
      if (match) {
        const pkgDir = path.join(packagesDir, match[1]);
        const fs = require('fs');
        const pkgPath = path.join(pkgDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
          const pkg = require(pkgPath);
          const main = (pkg.main || 'index.js').replace(/^\.\//, '');
          const entry = path.resolve(pkgDir, main);
          if (fs.existsSync(entry)) {
            return { type: 'sourceFile', filePath: entry };
          }
        }
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
