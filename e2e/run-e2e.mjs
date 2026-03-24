#!/usr/bin/env node
/**
 * Runs WebdriverIO for the chosen platform (default: iOS on macOS, Android elsewhere).
 * Override with `E2E_PLATFORM=ios` or `E2E_PLATFORM=android`.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const platform =
  process.env.E2E_PLATFORM ||
  (process.platform === 'darwin' ? 'ios' : 'android');
const script = platform === 'ios' ? 'wdio:ios' : 'wdio:android';

const result = spawnSync(
  'yarn',
  ['workspace', 'aepsdk-e2e', script],
  {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: true,
  },
);

process.exit(result.status === null ? 1 : result.status);
