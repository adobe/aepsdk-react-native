require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

# Old architecture is selected only explicitly (RCT_NEW_ARCH_ENABLED=0, e.g. BareSampleApp on RN 0.76).
# Unset or 1 (RN 0.85+) means New Architecture: the Obj-C++ TurboModule in ios/turbo is compiled.
# On iOS new arch the interop and turbo paths are the same binary; USE_INTEROP_ROOT is only defined
# for parity with the other packages and is not read by the Messaging sources.
old_arch = ENV['RCT_NEW_ARCH_ENABLED'] == '0'
use_interop_root = ENV.key?('USE_INTEROP_ROOT') ? ENV['USE_INTEROP_ROOT'].to_i : 0

Pod::Spec.new do |s|
  s.name         = "RCTAEPMessaging"
  s.version      = package["version"]
  s.summary      = "Messaging library for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"
  s.homepage     = "https://github.com/adobe/aepsdk-react-native"
  s.license      = "Apache 2.0 License"
  s.platform     = :ios, '12.0'
  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :tag => "#{s.version}" }
  s.swift_version = '5.1'

  s.dependency "AEPMessaging", ">= 5.12.0", "< 6.0.0"

  if old_arch
    # Classic bridge: Swift RCTEventEmitter module + RCT_EXTERN_MODULE registration.
    s.source_files = "ios/src/**/*.{h,m,mm,swift}"
    s.dependency "React"
  else
    # New architecture: Obj-C++ TurboModule over the plain-Swift implementation.
    s.source_files = [
      "ios/src/RCTAEPMessagingConstants.swift",
      "ios/src/RCTAEPMessagingDataBridge.swift",
      "ios/turbo/**/*.{h,m,mm,swift}"
    ]

    # The TurboModule headers include C++ (codegen spec / ReactCommon). Keep them out of the pod's
    # umbrella header: the Swift implementation imports the pod's clang module, which is built as
    # plain Obj-C and cannot parse C++ headers. The module provider resolves the class by name.
    s.private_header_files = "ios/turbo/*.h"

    s.pod_target_xcconfig = {
      "CLANG_ENABLE_MODULES" => "YES",
      "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules -include $(PODS_TARGET_SRCROOT)/ios/turbo/RCTAEPMessagingCppPrefix.h",
      "HEADER_SEARCH_PATHS" => "$(inherited) \"$(PODS_ROOT)/RCT-Folly\" \"$(PODS_ROOT)/DoubleConversion\" \"$(PODS_ROOT)/fmt/include\" \"$(PODS_CONFIGURATION_BUILD_DIR)/React-jsinspector/jsinspector_modern.framework/Headers\" \"$(PODS_ROOT)/../build/generated/ios\" \"$(PODS_ROOT)/../build/generated/ios/ReactCodegen\" \"$(PODS_ROOT)/Headers/Public/ReactCodegen\"",
      "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) USE_INTEROP_ROOT=#{use_interop_root}"
    }

    install_modules_dependencies(s, new_arch_enabled: ENV['RCT_NEW_ARCH_ENABLED'] == '1')
  end
end
