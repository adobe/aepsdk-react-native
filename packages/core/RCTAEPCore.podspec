require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# Build-time toggle for the RCTAEP{Core,Identity,Lifecycle,Signal}.{h,mm} preprocessor branches.
#   USE_INTEROP_ROOT=1 + RCT_NEW_ARCH_ENABLED=0  →  old-arch classic bridge (RCT_EXPORT_METHOD)
#   USE_INTEROP_ROOT=* + RCT_NEW_ARCH_ENABLED=1  →  new-arch turbo (same binary for 0/1)
#   USE_INTEROP_ROOT=0 + RCT_NEW_ARCH_ENABLED=0  →  old-arch turbo (unsupported smoke cell)
use_interop_root = ENV.key?('USE_INTEROP_ROOT') ? ENV['USE_INTEROP_ROOT'].to_i : 0

Pod::Spec.new do |s|
  s.name         = "RCTAEPCore"
  s.version      = package["version"]
  s.summary      = "Core library for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"

  s.homepage     = "https://github.com/adobe/aepsdk-react-native"

  s.license      = "Apache 2.0 License"
  s.platforms    = { :ios => "12.0", :tvos => "12.0" }

  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :tag => "#{s.version}" }

  s.requires_arc = true

  s.dependency 'AEPCore', '>= 5.4.0', '< 6.0.0'
  s.dependency 'AEPLifecycle', '>= 5.4.0', '< 6.0.0'
  s.dependency 'AEPIdentity', '>= 5.4.0', '< 6.0.0'
  s.dependency 'AEPSignal', '>= 5.4.0', '< 6.0.0'

  s.source_files  = "ios/src/**/*.{h,m,mm}"

  s.pod_target_xcconfig = {
    "CLANG_ENABLE_MODULES" => "YES",
    "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules -include $(PODS_TARGET_SRCROOT)/ios/RCTAEPCoreCppPrefix.h",
    "HEADER_SEARCH_PATHS" => "$(inherited) \"$(PODS_ROOT)/RCT-Folly\" \"$(PODS_ROOT)/DoubleConversion\" \"$(PODS_ROOT)/fmt/include\" \"$(PODS_CONFIGURATION_BUILD_DIR)/React-jsinspector/jsinspector_modern.framework/Headers\" \"$(PODS_ROOT)/../build/generated/ios\" \"$(PODS_ROOT)/../build/generated/ios/ReactCodegen\" \"$(PODS_ROOT)/Headers/Public/ReactCodegen\"",
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) USE_INTEROP_ROOT=#{use_interop_root}"
  }

  new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'
  install_modules_dependencies(s, new_arch_enabled: new_arch_enabled)
end
