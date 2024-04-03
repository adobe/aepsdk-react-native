require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCTAEPAssurance"
  s.version      = package["version"]
  s.summary      = "AEPAssurance library for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"

  s.homepage     = "https://github.com/adobe/aepsdk-react-native"

  s.license      = "Apache 2.0 License"
  s.platform      = :ios, '12.0'

  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :tag => "#{s.version}" }

  s.source_files  = "ios/src/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "AEPAssurance", ">= 5.0.0", "< 6.0.0"
end
