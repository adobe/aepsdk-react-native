# NativeAEPOptimizeModule is instantiated via Class.forName in RCTAEPOptimizePackage
# (new arch + USE_INTEROP_ROOT=false). There is no static reference R8 can trace, so release
# minification can strip or rename the class and break the turbo path at runtime.
-keep class com.adobe.marketing.mobile.reactnative.optimize.NativeAEPOptimizeModule { *; }
