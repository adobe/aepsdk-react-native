require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# Build-time toggle — mirrors Android's buildConfigField "boolean", "USE_INTEROP_ROOT", "false"
#   USE_INTEROP_ROOT=1 pod install  →  interop layer  (RN 0.76, RCTEventEmitter)
#   USE_INTEROP_ROOT=0 (default)    →  Turbo Module   (RN 0.84+, SpecBase + JSI events)
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

  s.pod_target_xcconfig = {
    "CLANG_ENABLE_MODULES" => "YES",
    "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules -include $(PODS_TARGET_SRCROOT)/ios/RCTAEPOptimizeCppPrefix.h",
    "HEADER_SEARCH_PATHS" => "$(inherited) \"$(PODS_ROOT)/RCT-Folly\" \"$(PODS_ROOT)/DoubleConversion\" \"$(PODS_ROOT)/fmt/include\" \"$(PODS_CONFIGURATION_BUILD_DIR)/React-jsinspector/jsinspector_modern.framework/Headers\" \"$(PODS_ROOT)/../build/generated/ios\" \"$(PODS_ROOT)/../build/generated/ios/ReactCodegen\" \"$(PODS_ROOT)/Headers/Public/ReactCodegen\"",
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) USE_INTEROP_ROOT=#{use_interop_root}"
  }

  # Codegen TurboModule headers need RCT-Folly + FOLLY_NO_CONFIG even when new arch is off
  # (interop path on RN 0.76 still implements getTurboModule: / NativeAEPOptimizeSpec).
  new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'
  install_modules_dependencies(s, new_arch_enabled: new_arch_enabled)
end
