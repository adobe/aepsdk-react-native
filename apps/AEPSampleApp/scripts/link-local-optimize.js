/**
 * Postinstall script: ensure @adobe/react-native-aepoptimize in node_modules
 * is a symlink to the local repo package (../../packages/optimize) so the app
 * always uses the local package and not a copy.
 */
const fs = require('fs');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');
const linkPath = path.join(appRoot, 'node_modules', '@adobe', 'react-native-aepoptimize');
const targetPath = path.join(appRoot, '..', '..', 'packages', 'optimize');

if (!fs.existsSync(targetPath)) {
  // Not in monorepo or packages/optimize missing; skip
  process.exit(0);
}

function ensureSymlink() {
  const targetResolved = path.resolve(targetPath);
  if (fs.existsSync(linkPath)) {
    try {
      const current = path.resolve(linkPath);
      const linkTarget = fs.readlinkSync(linkPath);
      const resolved = path.resolve(path.dirname(linkPath), linkTarget);
      if (path.relative(resolved, targetResolved) === '') {
        return; // already linked to local package
      }
    } catch (_) {
      // Not a symlink
    }
    fs.rmSync(linkPath, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  fs.symlinkSync(path.relative(path.dirname(linkPath), targetResolved), linkPath, 'dir');
}

ensureSymlink();
