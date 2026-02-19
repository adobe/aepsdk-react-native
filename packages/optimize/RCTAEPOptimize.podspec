require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCTAEPOptimize"
  s.version      = package["version"]
  s.summary      = "Experience Platform Optimize extension for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"
  s.homepage     = "https://github.com/adobe/aepsdk-react-native"
  s.license      = "Apache 2.0 License"

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :branch => "optimize" }

  s.source_files         = "ios/**/*.{h,m,mm}"
  s.public_header_files  = "ios/src/RCTAEPOptimize.h"
  s.requires_arc         = true

  s.dependency "AEPOptimize", ">= 5.0.0", "< 6.0.0"
  # Required when .mm imports ReactCodegen (spec pulls in RCTTypeSafety → React which needs jsinspector).
  s.dependency "React-jsinspector"

  # Required so that @import and AEP types work when compiling .mm (Objective-C++) files.
  # Allow non-modular includes so ReactCodegen (imported in .mm only) builds without -Werror.
  # When .mm imports ReactCodegen → RCTTypeSafety → React, React's umbrella needs jsinspector-modern/ReactCdp.h;
  # ensure that path is found (PODS_ROOT = ios/Pods, so ../../ = app root in typical RN app).
  s.pod_target_xcconfig = {
    "CLANG_ENABLE_MODULES" => "YES",
    "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules",
    "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES" => "YES",
    "HEADER_SEARCH_PATHS" => "$(inherited) \"$(PODS_ROOT)/../node_modules/react-native/ReactCommon\" \"$(PODS_ROOT)/../node_modules/react-native/ReactCommon/callinvoker\" \"$(PODS_ROOT)/../node_modules/react-native/ReactCommon/react\" \"$(PODS_ROOT)/../../node_modules/react-native/ReactCommon\" \"$(PODS_ROOT)/../../node_modules/react-native/ReactCommon/callinvoker\" \"$(PODS_ROOT)/../../node_modules/react-native/ReactCommon/react\""
  }

  install_modules_dependencies(s)
end
