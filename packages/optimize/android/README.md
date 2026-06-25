# Android — `@adobe/react-native-aepoptimize`

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

## Local development

Open `build.gradle` in Android Studio, or build from the sample app matrix scripts above.
