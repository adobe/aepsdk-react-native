# Android — `@adobe/react-native-aepoptimize`

> **iOS note:** On iOS **new arch**, `USE_INTEROP_ROOT` does not switch runtime paths — both flag values compile to `NativeAEPOptimizeSpecBase` + `getTurboModule:`. Only **iOS old arch + `USE_INTEROP_ROOT=1`** selects the classic `RCTEventEmitter` bridge. See [Optimize README](../README.md#react-native-new-architecture-turbo-module).

## Module layout

| New Architecture | Native entry | Notes |
| :--- | :--- | :--- |
| **Enabled** (`newArchEnabled=true`) | `NativeAEPOptimizeModule` (Turbo) or interop module when `USE_INTEROP_ROOT=true` | Codegen spec in `specs/NativeAEPOptimize.ts` |
| **Disabled** | `RCTAEPOptimizeModule` (bridge) | `NativeAEPOptimizeModule.java` excluded in `build.gradle` |

The library default is `USE_INTEROP_ROOT=false` (Turbo path when new arch is on). Consumer apps should override this from the **app** project if they need interop.

## Overriding `USE_INTEROP_ROOT` from your app

In the app root `android/build.gradle`:

```gradle
def optimizeUseInteropRoot = findProperty("USE_INTEROP_ROOT") ?: "false"

subprojects { subproject ->
    subproject.afterEvaluate {
        if (subproject.name == "adobe_react-native-aepoptimize") {
            subproject.android {
                defaultConfig {
                    buildConfigField "boolean", "USE_INTEROP_ROOT", optimizeUseInteropRoot
                }
            }
        }
    }
}
```

In `android/gradle.properties`:

```properties
newArchEnabled=true
USE_INTEROP_ROOT=false
```

Set `USE_INTEROP_ROOT=true` for the interop/bridge event path. [BareSampleApp](../../../apps/BareSampleApp/scripts/build-matrix.sh) and [AEPSampleApp](../../../apps/AEPSampleApp/scripts/build-matrix.sh) automate this toggle for smoke testing.

## ProGuard / R8

The turbo module (`NativeAEPOptimizeModule`) is loaded via `Class.forName` in `RCTAEPOptimizePackage` so old-arch builds can omit codegen sources. The library ships `consumer-rules.pro` via `consumerProguardFiles` so customer release builds with `minifyEnabled true` keep that class. No extra app-side rules are required.

## Local development

Open `build.gradle` in Android Studio, or build from the sample app matrix scripts above.
