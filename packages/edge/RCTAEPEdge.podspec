require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCTAEPEdge"
  s.version      = package["version"]
  s.summary      = "Adobe Experience Platform Edge Network extension for Adobe Experience Platform Mobile SDK. Written and maintained by Adobe"
  s.author       = "Adobe Experience Platform SDK Team"

  s.homepage     = "https://github.com/adobe/aepsdk-react-native"

  s.license      = "Apache 2.0 License"
  s.platform      = :ios, '11.0'

  s.source       = { :git => "https://github.com/adobe/aepsdk-react-native.git", :tag => "#{s.version}" }

  s.source_files  = "ios/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "AEPEdge", '>= 4.3.0'
end
