require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCTAEPOptimize"
  s.version      = package["version"]
  s.summary      = "Experience Platform Optimize extension for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"

  s.homepage     = "https://github.com/adobe/aepsdk-react-native"

  s.license      = "Apache 2.0 License"
  s.platform     = :ios, '11.0'

  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :branch => "optimize" }

  s.source_files  = 'ios/**/*.{h,m}'
  s.requires_arc = true

  s.dependency "React"  
  s.dependency "AEPOptimize", "~> 4.0"
end
