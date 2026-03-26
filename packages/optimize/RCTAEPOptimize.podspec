require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# Build-time toggle — mirrors Android's buildConfigField "boolean", "USE_INTEROP_ROOT", "false"
#   USE_INTEROP_ROOT=1 pod install  →  interop layer  (old arch, RCTEventEmitter)
#   USE_INTEROP_ROOT=0 (default)    →  Turbo Module   (new arch, getTurboModule:)
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

  s.dependency "React"
  s.dependency "React-Codegen"
  s.dependency "AEPOptimize", ">= 5.0.0", "< 6.0.0"

  s.pod_target_xcconfig = {
    "CLANG_ENABLE_MODULES" => "YES",
    "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules",
    "HEADER_SEARCH_PATHS" => "$(inherited) \"$(PODS_ROOT)/../build/generated/ios/ReactCodegen\" \"$(PODS_ROOT)/Headers/Public/ReactCodegen\"",
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) USE_INTEROP_ROOT=#{use_interop_root}"
  }
end
