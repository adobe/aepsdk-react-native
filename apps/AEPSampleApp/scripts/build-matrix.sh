#!/usr/bin/env bash
#
# AEPSampleApp — new-arch build matrix (RN 0.85)
#
# New Architecture only. Toggles USE_INTEROP_ROOT (Optimize turbo vs interop).
#
# Examples:
#   ./scripts/build-matrix.sh --preset ios-turbo -c full --sync --run
#   ./scripts/build-matrix.sh --preset android-interop -c full --sync --run
#   ./scripts/build-matrix.sh --list-matrix
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$APP_DIR/../.." && pwd)"
OPTIMIZE_PKG="$REPO_ROOT/packages/optimize"

IOS_SCHEME="AEPSampleApp"
IOS_WORKSPACE="AEPSampleApp.xcworkspace"
IOS_PODFILE_PROPS="$APP_DIR/ios/Podfile.properties.json"
ANDROID_GRADLE_PROPS="$APP_DIR/android/gradle.properties"
ANDROID_ROOT_BUILD="$APP_DIR/android/build.gradle"
ANDROID_DIR="$APP_DIR/android"

PLATFORM="both"
INTEROP="false"
CLEAN="light"
SYNC_DEPS=false
LINK_LOCAL_OPTIMIZE=false
RUN_APP=false
BUILD_ONLY=true
START_METRO=true
LIST_MATRIX=false
PRESET=""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}▸${NC} $*"; }
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}!${NC} $*"; }
die()  { echo -e "${RED}✗${NC} $*" >&2; exit 1; }

to_lower() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

usage() {
  cat <<'EOF'
Usage: build-matrix.sh [options]

AEPSampleApp (RN 0.85) — New Architecture only. Interop true/false for Optimize.

Options:
  -p, --platform ios|android|both   Platform (default: both)
  -i, --interop true|false          USE_INTEROP_ROOT (default: false = turbo)
  -c, --clean none|light|full       Clean level (default: light)
      --sync                        yarn install before build
      --link-optimize               use file:../../packages/optimize + prepare (monorepo local dev)
      --run                         Install, launch, connect Metro (default for yarn build:* scripts)
      --build-only                  Build only, no install/Metro
      --no-metro                    With --run, do not auto-start Metro
      --preset <name>                 ios-turbo | ios-interop
                                      android-turbo | android-interop
                                      both-turbo | both-interop
      --list-matrix                 Show cells and exit
  -h, --help

Config updated per run:
  ios/Podfile.properties.json       newArchEnabled=true (always)
  android/gradle.properties         newArchEnabled=true (always)
  android/gradle.properties         newArchEnabled=true, USE_INTEROP_ROOT

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
    ios-turbo|ios-new-turbo)       PLATFORM=ios;     INTEROP=false ;;
    ios-interop|ios-new-interop)   PLATFORM=ios;     INTEROP=true ;;
    android-turbo|android-new-turbo)     PLATFORM=android; INTEROP=false ;;
    android-interop|android-new-interop) PLATFORM=android; INTEROP=true ;;
    both-turbo|both-new-turbo)     PLATFORM=both;    INTEROP=false ;;
    both-interop|both-new-interop) PLATFORM=both;    INTEROP=true ;;
    *) die "Unknown preset: $1 (use --list-matrix)" ;;
  esac
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -p|--platform) PLATFORM="$(to_lower "$2")"; shift 2 ;;
      -i|--interop)  INTEROP="$(normalize_bool "$2")"; shift 2 ;;
      -c|--clean)    CLEAN="$(to_lower "$2")"; shift 2 ;;
      --preset)      PRESET="$(to_lower "$2")"; shift 2 ;;
      --sync)        SYNC_DEPS=true; shift ;;
      --link-optimize) LINK_LOCAL_OPTIMIZE=true; SYNC_DEPS=true; shift ;;
      --run)         RUN_APP=true; BUILD_ONLY=false; shift ;;
      --build-only)  BUILD_ONLY=true; RUN_APP=false; shift ;;
      --metro)       START_METRO=true; shift ;;
      --no-metro)    START_METRO=false; shift ;;
      --list-matrix) LIST_MATRIX=true; shift ;;
      -h|--help)     usage; exit 0 ;;
      -a|--arch)     die "Old arch is not supported on AEPSampleApp (RN 0.85 new arch only). Remove -a/--arch." ;;
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
  case "$CLEAN" in
    none|light|full) ;;
    *) die "Invalid clean level: $CLEAN" ;;
  esac
}

needs_ios() { [[ "$PLATFORM" == "ios" || "$PLATFORM" == "both" ]]; }
needs_android() { [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]; }

print_matrix() {
  cat <<'EOF'
AEPSampleApp build matrix (RN 0.85 — new arch only):

  # | Interop | USE_INTEROP | iOS path              | Android path
  --|---------|-------------|-----------------------|---------------------------
  1 | false   | 0 / false   | SpecBase turbo        | NativeAEPOptimizeModule
  2 | true    | 1 / true    | RCTEventEmitter+spec  | RCTAEPOptimizeModule

Presets:
  ios-turbo       ios-interop
  android-turbo   android-interop
  both-turbo      both-interop

Examples:
  yarn build:ios:turbo
  yarn build:android:interop
  ./scripts/build-matrix.sh --preset both-turbo -c full --sync --run
  ./scripts/build-matrix.sh --preset ios-interop -c full --link-optimize --run

EOF
}

apply_ios_config() {
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const j = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
    j.newArchEnabled = 'true';
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  " "$IOS_PODFILE_PROPS"
  ok "ios/Podfile.properties.json → newArchEnabled: true"
  export RCT_NEW_ARCH_ENABLED=1
  export USE_INTEROP_ROOT=$([[ "$INTEROP" == "true" ]] && echo 1 || echo 0)
}

apply_android_config() {
  if grep -q '^newArchEnabled=' "$ANDROID_GRADLE_PROPS"; then
    if [[ "$(uname)" == Darwin ]]; then
      sed -i '' 's/^newArchEnabled=.*/newArchEnabled=true/' "$ANDROID_GRADLE_PROPS"
    else
      sed -i 's/^newArchEnabled=.*/newArchEnabled=true/' "$ANDROID_GRADLE_PROPS"
    fi
  else
    echo "newArchEnabled=true" >> "$ANDROID_GRADLE_PROPS"
  fi
  ok "android/gradle.properties → newArchEnabled: true"

  if grep -q '^USE_INTEROP_ROOT=' "$ANDROID_GRADLE_PROPS"; then
    if [[ "$(uname)" == Darwin ]]; then
      sed -i '' "s/^USE_INTEROP_ROOT=.*/USE_INTEROP_ROOT=$INTEROP/" "$ANDROID_GRADLE_PROPS"
    else
      sed -i "s/^USE_INTEROP_ROOT=.*/USE_INTEROP_ROOT=$INTEROP/" "$ANDROID_GRADLE_PROPS"
    fi
  else
    echo "USE_INTEROP_ROOT=$INTEROP" >> "$ANDROID_GRADLE_PROPS"
  fi
  ok "android/gradle.properties → USE_INTEROP_ROOT: $INTEROP"
}

apply_config() {
  log "Applying config: newArch=true interop=$INTEROP platform=$PLATFORM"
  if needs_ios; then apply_ios_config; fi
  if needs_android; then apply_android_config; fi
}

link_local_optimize() {
  log "Linking @adobe/react-native-aepoptimize → file:../../packages/optimize"
  node -e "
    const fs = require('fs');
    const p = process.argv[1];
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    pkg.dependencies['@adobe/react-native-aepoptimize'] = 'file:../../packages/optimize';
    fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
  " "$APP_DIR/package.json"
}

sync_dependencies() {
  if $LINK_LOCAL_OPTIMIZE; then
    link_local_optimize
    (cd "$OPTIMIZE_PKG" && npm run prepare)
  fi
  log "yarn install"
  (cd "$APP_DIR" && yarn install)
  ok "Dependencies synced"
}

METRO_LOG="$APP_DIR/.metro-build-matrix.log"
METRO_PID_FILE="$APP_DIR/.metro-build-matrix.pid"

metro_is_running() {
  curl -sf "http://localhost:8081/status" 2>/dev/null | grep -q 'packager-status:running'
}

ensure_metro() {
  if ! $START_METRO; then
    log "Skipping Metro start (--no-metro); run: cd apps/AEPSampleApp && yarn start --reset-cache"
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
  local metro_pid=$!
  echo "$metro_pid" > "$METRO_PID_FILE"
  disown "$metro_pid" 2>/dev/null || true
  popd > /dev/null
  local i=0
  while [[ $i -lt 90 ]]; do
    if metro_is_running; then
      ok "Metro ready at http://localhost:8081 (pid ${metro_pid:-?})"
      return
    fi
    sleep 1
    i=$((i + 1))
  done
  die "Metro failed to start within 90s — check $METRO_LOG (or run 'yarn start --reset-cache' in another terminal)"
}

android_invalidate_autolinking() {
  [[ "$CLEAN" == "none" ]] && return
  log "Android: invalidating autolinking cache"
  rm -f "$ANDROID_DIR/build/generated/autolinking/autolinking.json" \
        "$ANDROID_DIR/build/generated/autolinking/"*.sha 2>/dev/null || true
}

ios_clean() {
  case "$CLEAN" in
    none) ;;
    light) log "iOS light clean: pod install refresh" ;;
    full)
      log "iOS full clean: Pods, Podfile.lock, DerivedData"
      rm -rf "$APP_DIR/ios/Pods" "$APP_DIR/ios/Podfile.lock"
      rm -rf "$HOME/Library/Developer/Xcode/DerivedData"/AEPSampleApp-* \
             "$HOME/Library/Developer/Xcode/DerivedData"/aepsampleapp-*
      ok "iOS caches removed"
      ;;
  esac
}

android_clean() {
  case "$CLEAN" in
    none) ;;
    light) android_invalidate_autolinking ;;
    full)
      log "Android full clean: .cxx, build, .gradle"
      rm -rf "$ANDROID_DIR/app/.cxx" "$ANDROID_DIR/app/build" \
             "$ANDROID_DIR/build" "$ANDROID_DIR/.gradle"
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
  log "pod install (RCT_NEW_ARCH_ENABLED=$RCT_NEW_ARCH_ENABLED USE_INTEROP_ROOT=$USE_INTEROP_ROOT)"
  (cd "$APP_DIR/ios" && RCT_NEW_ARCH_ENABLED="$RCT_NEW_ARCH_ENABLED" USE_INTEROP_ROOT="$USE_INTEROP_ROOT" pod install)

  if $RUN_APP; then
    log "run-ios (install + launch, --no-packager --mode Debug — Metro already running)"
    (cd "$APP_DIR" && npx react-native run-ios --scheme "$IOS_SCHEME" --no-packager --mode Debug)
    ok "iOS run-ios completed"
    return
  fi

  log "xcodebuild (simulator)"
  (cd "$APP_DIR/ios" && xcodebuild \
    -workspace "$IOS_WORKSPACE" \
    -scheme "$IOS_SCHEME" \
    -configuration Debug \
    -sdk iphonesimulator \
    -destination 'generic/platform=iOS Simulator' \
    build)
  ok "iOS build succeeded"
}

build_android() {
  if $RUN_APP; then
    ensure_metro
  fi

  android_clean

  if $RUN_APP; then
    log "run-android (install + launch, --no-packager — Metro already running, interop=$INTEROP)"
    (cd "$APP_DIR" && npx react-native run-android --no-packager)
    ok "Android run-android completed"
    return
  fi

  log "generateCodegenArtifactsFromSchema + assembleDebug"
  (cd "$ANDROID_DIR" && ./gradlew generateCodegenArtifactsFromSchema assembleDebug)
  ok "Android assembleDebug succeeded"
}

main() {
  parse_args "$@"

  if $LIST_MATRIX; then
    print_matrix
    exit 0
  fi

  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo " AEPSampleApp build matrix (RN 0.85 new arch)"
  [[ -n "$PRESET" ]] && echo " preset=$PRESET"
  echo " platform=$PLATFORM  interop=$INTEROP  clean=$CLEAN"
  echo "════════════════════════════════════════════════════════════"
  echo ""

  apply_config

  if $SYNC_DEPS || [[ "$CLEAN" == "full" ]]; then
    sync_dependencies
  elif [[ "$CLEAN" == "light" ]]; then
    log "Skipping yarn sync (use --sync, --link-optimize, or -c full)"
  fi

  if needs_ios; then build_ios; fi
  if needs_android; then build_android; fi

  echo ""
  ok "Done — newArchEnabled=true, USE_INTEROP_ROOT=$INTEROP"
  if $RUN_APP && $START_METRO; then
    log "Metro log: tail -f $METRO_LOG"
    log "If the app shows a red screen, check Metro for bundle errors (Cmd+R to reload simulator)"
  elif ! $RUN_APP; then
    log "Start Metro: cd apps/AEPSampleApp && yarn start --reset-cache"
  fi
}

main "$@"
