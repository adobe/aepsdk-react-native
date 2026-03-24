#!/usr/bin/env node
/**
 * Build AwesomeProject for the chosen platform, then run WebdriverIO (same rules as `run-e2e.mjs`).
 * Mirrors `e2e:android:build` / `e2e:ios:build` with platform auto-detection.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const platform =
  process.env.E2E_PLATFORM ||
  (process.platform === 'darwin' ? 'ios' : 'android');

const buildScript =
  platform === 'ios'
    ? 'awesomeproject:ios:build'
    : 'awesomeproject:android:assembleDebug';
const wdioScript = platform === 'ios' ? 'wdio:ios' : 'wdio:android';

const run = (args) =>
  spawnSync('yarn', args, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: true,
  });

const build = run([buildScript]);
if (build.status !== 0) {
  process.exit(build.status === null ? 1 : build.status);
}

const test = run(['workspace', 'aepsdk-e2e', wdioScript]);
process.exit(test.status === null ? 1 : test.status);
