require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCTAEPCore"
  s.version      = package["version"]
  s.summary      = "Core library for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"

  s.homepage     = "https://github.com/adobe/aepsdk-react-native"

  s.license      = "Apache 2.0 License"
  s.platforms    = { :ios => "10.0", :tvos => "10.0" }

  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :tag => "#{s.version}" }

  s.requires_arc = true

  s.dependency "React"
  s.dependency "AEPCore", '~> 3.0'
  s.dependency "AEPLifecycle", '~> 3.0'
  s.dependency "AEPIdentity", '~> 3.0'
  s.dependency "AEPSignal", '~> 3.0'

  s.source_files  = "ios/src/**/*.{h,m}"

end
