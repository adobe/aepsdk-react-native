const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Sets `ENV['USE_INTEROP_ROOT']` in the iOS Podfile.
 *
 * The AEP Optimize podspec (`packages/optimize/RCTAEPOptimize.podspec`) reads
 * this env var at `pod install` time to choose the iOS compile path:
 *   "0" = Turbo Module (New Architecture, default)
 *   "1" = interop layer (legacy bridge / RCTEventEmitter)
 *
 * Expo has no built-in app.json key for forwarding an arbitrary env var to a
 * third-party podspec, so we inject it into the Podfile. Because this runs on
 * every `expo prebuild`, it survives Podfile regeneration.
 *
 * Uses `||=` so a shell override (e.g. `USE_INTEROP_ROOT=1 pod install`) still
 * takes precedence for one-off builds.
 *
 * Usage in app.json:
 *   ["./plugins/withInteropRoot", { "value": "0" }]
 */
const START = '# >>> USE_INTEROP_ROOT (managed by withInteropRoot plugin)';
const END = '# <<< USE_INTEROP_ROOT';

const withInteropRoot = (config, { value = '0' } = {}) => {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'Podfile',
      );
      let contents = fs.readFileSync(podfilePath, 'utf8');

      const block = `${START}\nENV['USE_INTEROP_ROOT'] ||= '${value}'\n${END}\n`;

      // Drop any previously managed block so the value stays in sync.
      const blockRegex = new RegExp(`${START}[\\s\\S]*?${END}\\n?`);
      contents = contents.replace(blockRegex, '');

      // Insert just before prepare_react_native_project! (always present in
      // Expo Podfiles); fall back to prepending if the anchor moves.
      const anchor = 'prepare_react_native_project!';
      if (contents.includes(anchor)) {
        contents = contents.replace(anchor, `${block}\n${anchor}`);
      } else {
        contents = `${block}\n${contents}`;
      }

      fs.writeFileSync(podfilePath, contents);
      return cfg;
    },
  ]);
};

module.exports = withInteropRoot;
