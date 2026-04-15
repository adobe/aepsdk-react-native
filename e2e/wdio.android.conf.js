import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Monorepo root (parent of `e2e/`). */
const repoRoot = path.join(__dirname, '..');

/** Load `e2e/.env` so ANDROID_UDID / ANDROID_DEVICE_NAME / AWESOME_PROJECT_APK work without exporting in the shell. */
dotenv.config({ path: path.join(__dirname, '.env') });

const androidConfiguration = process.env.ANDROID_CONFIGURATION || 'debug';

/** Default APK path resolved from ANDROID_CONFIGURATION (debug or release). */
const DEFAULT_APK = path.join(
  repoRoot,
  `apps/AwesomeProject/android/app/build/outputs/apk/${androidConfiguration}/app-${androidConfiguration}.apk`,
);

/**
 * Resolves which APK Appium should install for the session.
 * Priority: AWESOME_PROJECT_APK → default APK (debug or release) if file exists → omit (package/activity only).
 * Set E2E_SKIP_APK=1 to never pass `app` (use an already-installed build).
 */
function resolveApkPath() {
  const skip = process.env.E2E_SKIP_APK === '1' || process.env.E2E_SKIP_APK === 'true';
  if (skip) {
    return undefined;
  }

  if (process.env.AWESOME_PROJECT_APK) {
    const raw = process.env.AWESOME_PROJECT_APK;
    return path.isAbsolute(raw) ? raw : path.resolve(__dirname, raw);
  }

  if (fs.existsSync(DEFAULT_APK)) {
    return DEFAULT_APK;
  }

  console.warn(
    `[aepsdk-e2e] No APK for Appium install. Expected:\n  ${DEFAULT_APK}\n` +
      `  Run: yarn awesomeproject:android:assembleDebug\n` +
      `  Or set AWESOME_PROJECT_APK, or E2E_SKIP_APK=1 if the app is already on the device.`,
  );
  return undefined;
}

const buildCapabilities = () => {
  const caps = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android',
    'appium:appPackage': 'com.awesomeproject',
    'appium:appActivity': 'com.awesomeproject.MainActivity',
    'appium:noReset': true,
    'appium:forceAppLaunch': true,
    'appium:newCommandTimeout': 120,
    'appium:waitForIdleTimeout': 0,
    'appium:appWaitDuration': 60000,
  };

  if (process.env.ANDROID_UDID) {
    caps['appium:udid'] = process.env.ANDROID_UDID;
  }

  const apk = resolveApkPath();
  if (apk) {
    caps['appium:app'] = apk;
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
        /** Use globally installed Appium (`npm install -g appium`). */
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
