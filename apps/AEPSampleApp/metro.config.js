/**
 * Metro configuration for React Native
 * https://reactnative.dev/docs/metro
 *
 * Monorepo-aware config. Watches specific directories instead of
 * the entire monorepo root to avoid file watcher limits and
 * Metro 0.84+ file map validation issues.
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = {
    // Watch specific directories needed for resolution
    watchFolders: [
        path.resolve(monorepoRoot, 'packages'),          // AEP SDK packages
        path.resolve(monorepoRoot, 'node_modules'),       // Root node_modules (hoisted deps)
    ],

    resolver: {
        // Tell Metro where to find node_modules
        nodeModulesPaths: [
            path.resolve(projectRoot, 'node_modules'),
            path.resolve(monorepoRoot, 'node_modules'),
        ],
        // Block nested node_modules inside packages to avoid duplicates
        blockList: [
            /packages\/.*\/node_modules\/.*/,
        ],
    },

    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
