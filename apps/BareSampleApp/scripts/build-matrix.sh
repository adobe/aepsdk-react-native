#!/usr/bin/env bash
#
# BareSampleApp — build matrix helper (RN 0.76)
#
# Configures new/old arch + USE_INTEROP_ROOT (Optimize turbo vs interop) and
# runs iOS and/or Android builds. Supports incremental, light, and full cleans.
#
# Examples:
#   ./scripts/build-matrix.sh --platform ios --arch new --interop false --clean full
#   ./scripts/build-matrix.sh --platform android --arch old --interop true --clean full --sync --run
#   ./scripts/build-matrix.sh --preset android-old-interop --clean full --sync --run
#   ./scripts/build-matrix.sh --list-matrix
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$APP_DIR/../.." && pwd)"
OPTIMIZE_PKG="$REPO_ROOT/packages/optimize"

IOS_SCHEME="BareSampleApp"
IOS_PODFILE_PROPS="$APP_DIR/ios/Podfile.properties.json"
ANDROID_GRADLE_PROPS="$APP_DIR/android/gradle.properties"
ANDROID_ROOT_BUILD="$APP_DIR/android/build.gradle"
ANDROID_DIR="$APP_DIR/android"

# Defaults
PLATFORM="both"
ARCH="new"
INTEROP="false"
CLEAN="light"
SYNC_DEPS=false
RUN_APP=false
BUILD_ONLY=true
START_METRO=true
LIST_MATRIX=false
PRESET=""
METRO_PID=""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}▸${NC} $*"; }
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}!${NC} $*"; }
die()  { echo -e "${RED}✗${NC} $*" >&2; exit 1; }

# macOS /bin/bash is 3.2 — avoid ${var,,} (requires bash 4+)
to_lower() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

usage() {
  cat <<'EOF'
Usage: build-matrix.sh [options]

Configure BareSampleApp for a TurboModule test cell and build iOS and/or Android.

Options:
  -p, --platform ios|android|both   Platform to build (default: both)
  -a, --arch new|old                New Architecture on/off (default: new)
  -i, --interop true|false          USE_INTEROP_ROOT for @adobe/react-native-aepoptimize
                                    true  = RCTEventEmitter / bridge interop
                                    false = Turbo SpecBase path (default)
  -c, --clean none|light|full       Clean level (default: light)
                                    none  = incremental build only
                                    light = invalidate autolinking + pod install / gradle
                                    full  = remove Pods, DerivedData, Android .cxx/build caches
      --sync                        Run optimize prepare + yarn install before build
      --run                         Launch app on simulator/device after build
      --build-only                  Build only, do not launch (default)
      --preset <name>               Shortcut for common cells (overrides -p -a -i):
                                    ios-old-interop      iOS old arch + interop
                                    ios-new-interop      iOS new arch + interop
                                    ios-new-turbo        iOS new arch + turbo
                                    android-old-interop  Android old arch + interop (primary)
                                    android-old-bridge   Android old arch + turbo flag off*
                                    android-new-interop  Android new arch + interop
                                    android-new-turbo    Android new arch + turbo
                                    both-new-turbo       Both platforms, new arch turbo
                                    * old Android always uses bridge module; flag still toggles BuildConfig
      --list-matrix                 Print all combinations and exit
  -h, --help                        Show this help

Config files updated (platform-specific):
  ios/Podfile.properties.json       → newArchEnabled (ios | both)
  android/gradle.properties         → newArchEnabled (android | both)
  android/build.gradle              → USE_INTEROP_ROOT (android | both)

iOS pod install env:
  RCT_NEW_ARCH_ENABLED=0|1
  USE_INTEROP_ROOT=0|1

Recommended cells (RN 0.76):
  iOS     old + interop true   — primary iOS 0.76 bridge path
  iOS     new + interop false  — turbo path (recommended new arch)
  Android old + interop true   — primary Android 0.76 path (always bridge module)
  Android new + interop false  — turbo NativeAEPOptimizeModule
  iOS     old + interop false  — NOT supported (methods not exported)

EOF
}

normalize_bool() {
  case "$(to_lower "$1")" in
    true|1|yes|on)  echo "true" ;;
    false|0|no|off) echo "false" ;;
    *) die "Invalid boolean: $1 (use true/false)" ;;
  esac
}

apply_preset() {
  case "$1" in
    ios-old-interop)      PLATFORM=ios;     ARCH=old; INTEROP=true ;;
    ios-new-interop)      PLATFORM=ios;     ARCH=new; INTEROP=true ;;
    ios-new-turbo)        PLATFORM=ios;     ARCH=new; INTEROP=false ;;
    android-old-interop)  PLATFORM=android; ARCH=old; INTEROP=true ;;
    android-old-bridge)   PLATFORM=android; ARCH=old; INTEROP=false ;;
    android-new-interop)  PLATFORM=android; ARCH=new; INTEROP=true ;;
    android-new-turbo)    PLATFORM=android; ARCH=new; INTEROP=false ;;
    both-new-turbo)       PLATFORM=both;    ARCH=new; INTEROP=false ;;
    *) die "Unknown preset: $1 (use --list-matrix)" ;;
  esac
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -p|--platform)
        PLATFORM="$(to_lower "$2")"
        shift 2
        ;;
      -a|--arch)
        ARCH="$(to_lower "$2")"
        shift 2
        ;;
      -i|--interop)
        INTEROP="$(normalize_bool "$2")"
        shift 2
        ;;
      -c|--clean)
        CLEAN="$(to_lower "$2")"
        shift 2
        ;;
      --preset)
        PRESET="$(to_lower "$2")"
        shift 2
        ;;
      --sync) SYNC_DEPS=true; shift ;;
      --run)  RUN_APP=true; BUILD_ONLY=false; shift ;;
      --build-only) BUILD_ONLY=true; RUN_APP=false; shift ;;
      --metro) START_METRO=true; shift ;;
      --no-metro) START_METRO=false; shift ;;
      --list-matrix) LIST_MATRIX=true; shift ;;
      -h|--help) usage; exit 0 ;;
      *) die "Unknown option: $1 (use --help)" ;;
    esac
  done

  if [[ -n "$PRESET" ]]; then
    apply_preset "$PRESET"
  fi

  case "$PLATFORM" in
    ios|android|both) ;;
    *) die "Invalid platform: $PLATFORM" ;;
  esac
  case "$ARCH" in
    new|old) ;;
    *) die "Invalid arch: $ARCH" ;;
  esac
  case "$CLEAN" in
    none|light|full) ;;
    *) die "Invalid clean level: $CLEAN" ;;
  esac
}

needs_ios() {
  [[ "$PLATFORM" == "ios" || "$PLATFORM" == "both" ]]
}

needs_android() {
  [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]
}

print_matrix() {
  cat <<'EOF'
BareSampleApp build matrix — 4 arch×interop cells (each platform):

  # | Arch | Interop | Optimize USE_INTEROP | iOS native root        | Android native root
  --|------|---------|----------------------|------------------------|-----------------------------
  1 | old  | true    | true                 | RCTEventEmitter bridge | RCTAEPOptimizeModule (bridge)
  2 | old  | false   | false                | SpecBase (broken)      | RCTAEPOptimizeModule (bridge)*
  3 | new  | true    | true                 | RCTEventEmitter+spec   | RCTAEPOptimizeModule (bridge)
  4 | new  | false   | false                | SpecBase turbo         | NativeAEPOptimizeModule (turbo)

  * Android old arch always loads RCTAEPOptimizeModule regardless of USE_INTEROP_ROOT;
    the flag still updates BuildConfig for parity with iOS test cells.

Presets:
  ios-old-interop       android-old-interop (primary 0.76 cells)
  ios-new-turbo         android-new-turbo     (primary new-arch cells)
  ios-new-interop       android-new-interop   (interop-on-new-arch smoke tests)
  android-old-bridge    old Android + USE_INTEROP_ROOT=false
  both-new-turbo        both platforms, new arch turbo

Example commands:

  # iOS
  ./scripts/build-matrix.sh --preset ios-old-interop      -c full --sync --run
  ./scripts/build-matrix.sh --preset ios-new-turbo        -c full --sync --run
  ./scripts/build-matrix.sh --preset ios-new-interop      -c full --sync --run

  # Android (including old arch)
  ./scripts/build-matrix.sh --preset android-old-interop  -c full --sync --run
  ./scripts/build-matrix.sh --preset android-old-bridge   -c full --sync --run
  ./scripts/build-matrix.sh --preset android-new-turbo    -c full --sync --run
  ./scripts/build-matrix.sh --preset android-new-interop  -c full --sync --run

  # Both
  ./scripts/build-matrix.sh --preset both-new-turbo       -c full --sync

EOF
}

apply_ios_config() {
  local new_arch_enabled="$1"

  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const v = process.argv[2];
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    j.newArchEnabled = v;
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  " "$IOS_PODFILE_PROPS" "$new_arch_enabled"
  ok "ios/Podfile.properties.json → newArchEnabled: $new_arch_enabled"

  export RCT_NEW_ARCH_ENABLED=$([[ "$new_arch_enabled" == "true" ]] && echo 1 || echo 0)
}

apply_android_config() {
  local new_arch_enabled="$1"
  local interop_enabled="$2"

  if grep -q '^newArchEnabled=' "$ANDROID_GRADLE_PROPS"; then
    if [[ "$(uname)" == Darwin ]]; then
      sed -i '' "s/^newArchEnabled=.*/newArchEnabled=$new_arch_enabled/" "$ANDROID_GRADLE_PROPS"
    else
      sed -i "s/^newArchEnabled=.*/newArchEnabled=$new_arch_enabled/" "$ANDROID_GRADLE_PROPS"
    fi
  else
    echo "newArchEnabled=$new_arch_enabled" >> "$ANDROID_GRADLE_PROPS"
  fi
  ok "android/gradle.properties → newArchEnabled: $new_arch_enabled"

  if [[ "$(uname)" == Darwin ]]; then
    sed -i '' "s/buildConfigField \"boolean\", \"USE_INTEROP_ROOT\", \"\(true\|false\)\"/buildConfigField \"boolean\", \"USE_INTEROP_ROOT\", \"$interop_enabled\"/" "$ANDROID_ROOT_BUILD"
  else
    sed -i "s/buildConfigField \"boolean\", \"USE_INTEROP_ROOT\", \"\(true\|false\)\"/buildConfigField \"boolean\", \"USE_INTEROP_ROOT\", \"$interop_enabled\"/" "$ANDROID_ROOT_BUILD"
  fi
  ok "android/build.gradle → USE_INTEROP_ROOT: $interop_enabled"

  if [[ "$new_arch_enabled" == "false" ]]; then
    log "Android old arch: RCTAEPOptimizePackage always registers bridge module (RCTAEPOptimizeModule)"
  fi
}

apply_config() {
  local new_arch_enabled="$1"
  local interop_enabled="$2"
  local ios_interop="$3"

  log "Applying config: newArch=$new_arch_enabled interop=$interop_enabled platform=$PLATFORM"

  if needs_ios; then
    apply_ios_config "$new_arch_enabled"
    export USE_INTEROP_ROOT="$ios_interop"
  fi

  if needs_android; then
    apply_android_config "$new_arch_enabled" "$interop_enabled"
  fi

  if [[ "$ARCH" == "old" && "$INTEROP" == "false" ]] && needs_ios; then
    warn "iOS old arch + interop false is NOT supported (Optimize methods won't export)."
  fi

  if [[ "$ARCH" == "old" && "$INTEROP" == "false" ]] && needs_android; then
    warn "Android old arch ignores turbo path — still uses RCTAEPOptimizeModule; USE_INTEROP_ROOT=false only affects BuildConfig."
  fi
}

sync_dependencies() {
  log "Syncing @adobe/react-native-aepoptimize (packages/optimize → node_modules)"
  (cd "$OPTIMIZE_PKG" && npm run prepare)
  (cd "$APP_DIR" && yarn install)
  ok "Dependencies synced"
}

metro_is_running() {
  curl -sf "http://localhost:8081/status" 2>/dev/null | grep -q 'packager-status:running'
}

METRO_LOG="$APP_DIR/.metro-build-matrix.log"
METRO_PID_FILE="$APP_DIR/.metro-build-matrix.pid"

ensure_metro() {
  if ! $START_METRO; then
    log "Skipping Metro start (--no-metro); run: cd apps/BareSampleApp && yarn start --reset-cache"
    return
  fi
  if metro_is_running; then
    ok "Metro already running on :8081 (reusing existing server)"
    return
  fi
  log "Starting Metro in background (--reset-cache) → $METRO_LOG"
  rm -f "$METRO_PID_FILE"
  pushd "$APP_DIR" > /dev/null
  nohup npx react-native start --reset-cache >> "$METRO_LOG" 2>&1 &
  METRO_PID=$!
  echo "$METRO_PID" > "$METRO_PID_FILE"
  disown "$METRO_PID" 2>/dev/null || true
  popd > /dev/null
  local i=0
  while [[ $i -lt 90 ]]; do
    if metro_is_running; then
      ok "Metro ready at http://localhost:8081 (pid ${METRO_PID:-?})"
      return
    fi
    sleep 1
    i=$((i + 1))
  done
  die "Metro failed to start within 90s — check $METRO_LOG (or run 'yarn start --reset-cache' in another terminal)"
}

android_invalidate_autolinking() {
  if [[ "$CLEAN" == "none" ]]; then
    return
  fi
  log "Android: invalidating autolinking / codegen cache (arch or interop may have changed)"
  rm -f "$ANDROID_DIR/build/generated/autolinking/autolinking.json" \
        "$ANDROID_DIR/build/generated/autolinking/"*.sha 2>/dev/null || true
}

ios_clean() {
  case "$CLEAN" in
    none) ;;
    light)
      log "iOS light clean: pod install refresh (keeping DerivedData)"
      ;;
    full)
      log "iOS full clean: Pods, Podfile.lock, DerivedData"
      rm -rf "$APP_DIR/ios/Pods" "$APP_DIR/ios/Podfile.lock"
      rm -rf "$HOME/Library/Developer/Xcode/DerivedData"/BareSampleApp-*
      ok "iOS caches removed"
      ;;
  esac
}

android_clean() {
  case "$CLEAN" in
    none) ;;
    light)
      android_invalidate_autolinking
      ;;
    full)
      log "Android full clean: .cxx, build dirs, .gradle (avoid gradlew clean — CMake glob issues)"
      rm -rf "$ANDROID_DIR/app/.cxx" \
             "$ANDROID_DIR/app/build" \
             "$ANDROID_DIR/build" \
             "$ANDROID_DIR/.gradle"
      android_invalidate_autolinking
      ok "Android caches removed"
      ;;
  esac
}

build_ios() {
  if $RUN_APP; then
    ensure_metro
  fi

  ios_clean

  log "iOS pod install (RCT_NEW_ARCH_ENABLED=$RCT_NEW_ARCH_ENABLED USE_INTEROP_ROOT=$USE_INTEROP_ROOT)"
  (cd "$APP_DIR/ios" && RCT_NEW_ARCH_ENABLED="$RCT_NEW_ARCH_ENABLED" USE_INTEROP_ROOT="$USE_INTEROP_ROOT" pod install)

  if $RUN_APP; then
    log "run-ios (install + launch, --no-packager --mode Debug — Metro already running)"
    (cd "$APP_DIR" && npx react-native run-ios --scheme "$IOS_SCHEME" --no-packager --mode Debug)
    ok "iOS run-ios completed"
    return
  fi

  log "iOS xcodebuild (simulator, Debug)"
  local sim
  sim=$(xcrun simctl list devices available -j 2>/dev/null | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    devs = []
    for rt, items in d.get('devices', {}).items():
        if 'iOS' in rt:
            ver = rt.split('iOS-')[-1].replace('-', '.') if 'iOS-' in rt else '0'
            for i in items:
                if i.get('isAvailable') and 'iPhone' in i.get('name', ''):
                    devs.append((ver, i['udid']))
    devs.sort(key=lambda x: [int(p) if p.isdigit() else 0 for p in x[0].split('.')], reverse=True)
    print(devs[0][1] if devs else '')
except Exception:
    print('')
" 2>/dev/null || true)

  local dest="generic/platform=iOS Simulator"
  if [[ -n "$sim" ]]; then
    dest="platform=iOS Simulator,id=$sim"
  fi

  (cd "$APP_DIR/ios" && xcodebuild \
    -workspace BareSampleApp.xcworkspace \
    -scheme "$IOS_SCHEME" \
    -configuration Debug \
    -sdk iphonesimulator \
    -destination "$dest" \
    build)
  ok "iOS build succeeded"
}

build_android() {
  android_clean

  local new_arch_enabled
  new_arch_enabled=$(grep '^newArchEnabled=' "$ANDROID_GRADLE_PROPS" | cut -d= -f2)

  if $RUN_APP; then
    ensure_metro
    log "Installing fresh debug APK + launch (run-android --no-packager, newArchEnabled=$new_arch_enabled USE_INTEROP_ROOT=$INTEROP)"
    (cd "$APP_DIR" && npx react-native run-android --no-packager)
    ok "Android run-android completed — app reinstalled and connected to Metro"
    return
  fi

  if [[ "$new_arch_enabled" == "true" ]]; then
    log "Android new arch: generating codegen artifacts"
    (cd "$ANDROID_DIR" && ./gradlew generateCodegenArtifactsFromSchema)
  else
    log "Android old arch: skipping turbo codegen (bridge modules only)"
  fi

  log "Android assembleDebug only (newArchEnabled=$new_arch_enabled USE_INTEROP_ROOT=$INTEROP)"
  log "APK built but NOT installed — add --run to reinstall on device/emulator"
  (cd "$ANDROID_DIR" && ./gradlew assembleDebug)
  ok "Android assembleDebug succeeded"
}

main() {
  parse_args "$@"

  if $LIST_MATRIX; then
    print_matrix
    exit 0
  fi

  local new_arch interop_ios
  new_arch=$([[ "$ARCH" == "new" ]] && echo "true" || echo "false")
  interop_ios=$([[ "$INTEROP" == "true" ]] && echo "1" || echo "0")

  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo " BareSampleApp build matrix"
  if [[ -n "$PRESET" ]]; then
    echo " preset=$PRESET"
  fi
  echo " platform=$PLATFORM  arch=$ARCH  interop=$INTEROP  clean=$CLEAN"
  echo "════════════════════════════════════════════════════════════"
  echo ""

  apply_config "$new_arch" "$INTEROP" "$interop_ios"

  if $SYNC_DEPS || [[ "$CLEAN" == "full" ]]; then
    sync_dependencies
  elif [[ "$CLEAN" == "light" ]]; then
    log "Skipping yarn sync (use --sync or -c full to refresh file: optimize package)"
  fi

  if needs_ios; then
    build_ios
  fi

  if needs_android; then
    build_android
  fi

  echo ""
  ok "Done — config left at: newArchEnabled=$new_arch, USE_INTEROP_ROOT=$INTEROP"
  if ! $RUN_APP; then
    log "Start Metro: cd apps/BareSampleApp && npx react-native start --reset-cache"
  fi
}

main "$@"
