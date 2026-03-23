const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { resolve, join } = require('path');

const projectRoot = __dirname;
/** Repo root: apps/AwesomeProject -> ../.. */
const monorepoRoot = resolve(projectRoot, '../..');

/**
 * Local workspace packages live under packages/<name> (folder name matches
 * @adobe/react-native-aep<folder> without the prefix).
 */
const ADOBE_PACKAGE_FOLDERS = [
  'core',
  'edge',
  'assurance',
  'campaignclassic',
  'edgebridge',
  'edgeconsent',
  'edgeidentity',
  'messaging',
  'optimize',
  'places',
  'target',
  'userprofile',
];

const extraNodeModules = {
  ...Object.fromEntries(
    ADOBE_PACKAGE_FOLDERS.map((folder) => [
      `@adobe/react-native-aep${folder}`,
      join(monorepoRoot, 'packages', folder),
    ]),
  ),
  /**
   * Yarn hoists @babel/runtime to the repo root; Metro only searches app + apps/node_modules
   * by default. Point the package root at root node_modules so helpers/* resolve.
   */
  '@babel/runtime': join(monorepoRoot, 'node_modules/@babel/runtime'),
};

/**
 * Metro for monorepo:
 * - Watch local package sources.
 * - Resolve hoisted deps from repo root (see @babel/runtime above).
 * - Map @adobe/react-native-aep* to ../../packages/* only (no catch-all Proxy).
 */
const config = {
  /**
   * Metro only resolves modules inside `projectRoot` + `watchFolders`.
   * Hoisted packages live in `<repo>/node_modules`; include that folder or
   * resolution fails even when `extraNodeModules` points at a path outside the app.
   */
  watchFolders: [
    resolve(monorepoRoot, 'packages'),
    resolve(monorepoRoot, 'node_modules'),
  ],
  resolver: {
    nodeModulesPaths: [
      resolve(projectRoot, 'node_modules'),
      resolve(monorepoRoot, 'node_modules'),
    ],
    extraNodeModules,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
