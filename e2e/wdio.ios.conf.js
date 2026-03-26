import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Monorepo root (parent of `e2e/`). */
const repoRoot = path.join(__dirname, '..');

/** Load `e2e/.env` so IOS_UDID / IOS_DEVICE_NAME / AWESOME_PROJECT_APP work without exporting in the shell. */
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Default simulator .app after building with fixed DerivedData, e.g.:
 *   yarn awesomeproject:ios:build          → Debug-iphonesimulator
 *   yarn awesomeproject:ios:build:release  → Release-iphonesimulator
 *
 * Override via IOS_CONFIGURATION=Release (set by e2e:ios:build:release:* scripts).
 * @see apps/AwesomeProject/ios — bundle id `org.reactjs.native.example.AwesomeProject`
 */
const iosConfiguration = process.env.IOS_CONFIGURATION || 'Debug';
const DEFAULT_DEBUG_APP = path.join(
  repoRoot,
  `apps/AwesomeProject/ios/build/Build/Products/${iosConfiguration}-iphonesimulator/AwesomeProject.app`,
);

/**
 * Resolves which .app Appium should install for the session.
 * Priority: AWESOME_PROJECT_APP → default path if file exists → omit (bundleId only).
 * Set E2E_SKIP_APP=1 to never pass `app` (use an already-installed build).
 */
function resolveIosAppPath() {
  const skip = process.env.E2E_SKIP_APP === '1' || process.env.E2E_SKIP_APP === 'true';
  if (skip) {
    return undefined;
  }

  if (process.env.AWESOME_PROJECT_APP) {
    const raw = process.env.AWESOME_PROJECT_APP;
    return path.isAbsolute(raw) ? raw : path.resolve(__dirname, raw);
  }

  if (fs.existsSync(DEFAULT_DEBUG_APP)) {
    return DEFAULT_DEBUG_APP;
  }

  console.warn(
    `[aepsdk-e2e] No .app for Appium install. Expected:\n  ${DEFAULT_DEBUG_APP}\n` +
      `  Run: yarn awesomeproject:ios:build\n` +
      `  Or set AWESOME_PROJECT_APP, or E2E_SKIP_APP=1 if the app is already on the simulator.`,
  );
  return undefined;
}

const IOS_BUNDLE_ID = 'org.reactjs.native.example.AwesomeProject';

const buildCapabilities = () => {
  const caps = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 16',
    'appium:noReset': true,
    'appium:newCommandTimeout': 120,
    'appium:wdaLaunchTimeout': 120000,
  };

  if (process.env.IOS_UDID) {
    caps['appium:udid'] = process.env.IOS_UDID;
  }

  if (process.env.IOS_PLATFORM_VERSION) {
    caps['appium:platformVersion'] = process.env.IOS_PLATFORM_VERSION;
  }

  const app = resolveIosAppPath();
  if (app) {
    caps['appium:app'] = app;
  } else {
    /** Session with pre-installed app (E2E_SKIP_APP / missing .app path). */
    caps['appium:bundleId'] = IOS_BUNDLE_ID;
  }

  return caps;
};

export const config = {
  runner: 'local',
  specs: ['./test/specs/**/*.spec.js'],
  maxInstances: 1,
  capabilities: [buildCapabilities()],
  logLevel: 'info',
  services: [
    [
      'appium',
      {
        command: 'appium',
        logPath: './logs',
      },
    ],
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
};
