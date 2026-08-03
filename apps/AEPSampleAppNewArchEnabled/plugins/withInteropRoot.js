const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Applies the two iOS Podfile fixes this app needs. Both run on every
 * `expo prebuild`, so they survive Podfile regeneration (ios/ is CNG/gitignored,
 * and CI regenerates it — a hand edit to ios/Podfile would be lost).
 *
 * 1. USE_INTEROP_ROOT env var
 *    The AEP Optimize podspec (packages/optimize/RCTAEPOptimize.podspec) reads
 *    this at `pod install` time to pick the iOS compile path:
 *      "0" = Turbo Module (New Architecture) — always what we want here
 *      "1" = interop layer (legacy bridge / RCTEventEmitter)
 *    `||=` lets a shell override (USE_INTEROP_ROOT=1 pod install) win for one-offs.
 *
 * 2. Non-modular header fix (post_install)
 *    use_frameworks! :static + Clang modules (Expo SDK 56) makes Clang reject the
 *    plain #includes React Native's OWN headers do across framework boundaries
 *    (folly/dynamic.h in `jsi`, FBLazyVector.h in `RCTTypeSafety`, jsinspector
 *    ReactCdp.h in `React`) under -Werror=non-modular-include-in-framework-module.
 *    It's an RN-side problem, so we allow it project-wide on every pod target and
 *    add the RN 0.85 jsinspector cdp/tracing header dirs (split into sibling pods).
 *
 * Usage in app.json:
 *   ["./plugins/withInteropRoot", { "value": "0" }]
 */
const INTEROP_START = '# >>> USE_INTEROP_ROOT (managed by withInteropRoot plugin)';
const INTEROP_END = '# <<< USE_INTEROP_ROOT';
const HEADERS_START = '# >>> non-modular headers (managed by withInteropRoot plugin)';
const HEADERS_END = '# <<< non-modular headers';

const withInteropRoot = (config, { value = '0' } = {}) => {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'Podfile',
      );
      let contents = fs.readFileSync(podfilePath, 'utf8');

      // --- 1. USE_INTEROP_ROOT env var (before prepare_react_native_project!) ---
      const interopBlock = `${INTEROP_START}\nENV['USE_INTEROP_ROOT'] ||= '${value}'\n${INTEROP_END}\n`;
      contents = contents.replace(
        new RegExp(`${INTEROP_START}[\\s\\S]*?${INTEROP_END}\\n?`),
        '',
      );
      const interopAnchor = 'prepare_react_native_project!';
      contents = contents.includes(interopAnchor)
        ? contents.replace(interopAnchor, `${interopBlock}\n${interopAnchor}`)
        : `${interopBlock}\n${contents}`;

      // --- 2. Non-modular header fix (first statement in post_install) ---
      const headersBlock = `    ${HEADERS_START}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
        paths = bc.build_settings['HEADER_SEARCH_PATHS'] || '$(inherited)'
        paths = paths.join(' ') if paths.is_a?(Array)
        bc.build_settings['HEADER_SEARCH_PATHS'] = paths + ' "$(PODS_CONFIGURATION_BUILD_DIR)/React-jsinspectorcdp/jsinspector_moderncdp.framework/Headers" "$(PODS_CONFIGURATION_BUILD_DIR)/React-jsinspectortracing/jsinspector_moderntracing.framework/Headers"'
      end
    end
    ${HEADERS_END}
`;
      contents = contents.replace(
        new RegExp(`[ \\t]*${HEADERS_START}[\\s\\S]*?${HEADERS_END}\\n?`),
        '',
      );
      const headersAnchor = 'post_install do |installer|\n';
      contents = contents.replace(headersAnchor, `${headersAnchor}${headersBlock}`);

      fs.writeFileSync(podfilePath, contents);
      return cfg;
    },
  ]);
};

module.exports = withInteropRoot;
