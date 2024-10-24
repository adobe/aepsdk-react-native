require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "RCTAEPMessaging"
  s.version      = package["version"]
  s.summary      = "Messaging library for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"
  s.homepage     = "https://github.com/adobe/aepsdk-react-native"
  s.license      = "Apache 2.0 License"
  s.platform     = :ios, '12.0'
  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.swift_version = '5.1'

  s.dependency "React"
  s.dependency "AEPMessaging", ">= 5.3.0", "< 6.0.0"
end
