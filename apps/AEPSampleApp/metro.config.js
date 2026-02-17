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
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { resolve, join } = require('path');

const packagesDir = resolve(__dirname, '../../packages');
const adobePackages = [
    'assurance', 'campaignclassic', 'core', 'edge', 'edgebridge', 'edgeconsent',
    'edgeidentity', 'messaging', 'optimize', 'places', 'target', 'userprofile',
];
const appNodeModules = join(__dirname, 'node_modules');
const extraNodeModules = {
    tslib: join(appNodeModules, 'tslib'),
};
adobePackages.forEach((name) => {
    extraNodeModules['@adobe/react-native-aep' + name] = join(packagesDir, name);
});

const config = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
    watchFolders: [packagesDir],
    resolver: {
        unstable_enableSymlinks: true,
        unstable_enablePackageExports: true,
        extraNodeModules,
        nodeModulesPaths: [join(__dirname, 'node_modules')],
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
