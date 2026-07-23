require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# Build-time toggle for RCTAEPOptimize.{h,mm} preprocessor branches.
#   USE_INTEROP_ROOT=1 + RCT_NEW_ARCH_ENABLED=0  →  old-arch classic bridge (RCTEventEmitter)
#   USE_INTEROP_ROOT=* + RCT_NEW_ARCH_ENABLED=1  →  new-arch turbo (NativeAEPOptimizeSpecBase; same binary for 0/1)
#   USE_INTEROP_ROOT=0 + RCT_NEW_ARCH_ENABLED=0  →  old-arch SpecBase (unsupported smoke cell)
# On iOS new arch, codegen + getTurboModule: always resolves as TurboModule — not RN's automatic interop layer.
# Android: USE_INTEROP_ROOT still switches bridge vs turbo module at runtime on new arch.
use_interop_root = ENV.key?('USE_INTEROP_ROOT') ? ENV['USE_INTEROP_ROOT'].to_i : 0

Pod::Spec.new do |s|
  s.name         = "RCTAEPOptimize"
  s.version      = package["version"]
  s.summary      = "Experience Platform Optimize extension for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"

  s.homepage     = "https://github.com/adobe/aepsdk-react-native"

  s.license      = "Apache 2.0 License"
  s.platform     = :ios, '12.0'

  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :tag => "#{s.version}" }

  s.source_files  = 'ios/**/*.{h,m,mm}'
  s.requires_arc = true

  s.dependency "AEPOptimize", ">= 5.0.0", "< 6.0.0"
  s.dependency "React-jsinspectorcdp"
  s.dependency "React-jsinspectortracing"

  s.pod_target_xcconfig = {
    "CLANG_ENABLE_MODULES" => "YES",
    "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES" => "YES",
    "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules -include $(PODS_TARGET_SRCROOT)/ios/RCTAEPOptimizeCppPrefix.h",
    "HEADER_SEARCH_PATHS" => "$(inherited) \"$(PODS_ROOT)/RCT-Folly\" \"$(PODS_ROOT)/DoubleConversion\" \"$(PODS_ROOT)/fmt/include\" \"$(PODS_CONFIGURATION_BUILD_DIR)/React-jsinspector/jsinspector_modern.framework/Headers\" \"$(PODS_CONFIGURATION_BUILD_DIR)/React-jsinspectorcdp/jsinspector_moderncdp.framework/Headers\" \"$(PODS_CONFIGURATION_BUILD_DIR)/React-jsinspectortracing/jsinspector_moderntracing.framework/Headers\" \"$(PODS_ROOT)/../build/generated/ios\" \"$(PODS_ROOT)/../build/generated/ios/ReactCodegen\" \"$(PODS_ROOT)/Headers/Public/ReactCodegen\"",
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) USE_INTEROP_ROOT=#{use_interop_root}"
  }

  # Codegen TurboModule headers need RCT-Folly + FOLLY_NO_CONFIG even when new arch is off
  # (interop path on RN 0.76 still implements getTurboModule: / NativeAEPOptimizeSpec).
  new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'
  install_modules_dependencies(s, new_arch_enabled: new_arch_enabled)
end
