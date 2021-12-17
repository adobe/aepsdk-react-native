require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCTAEPOptimize"
  s.version      = package["version"]
  s.summary      = "Messaging library for Adobe Experience Platform Mobile SDK. Written and Supported by Adobe."
  s.author       = "Adobe Experience Platform SDK Team"

  s.homepage     = "https://github.com/adobe/aepsdk-react-native"

  s.license      = "Apache 2.0 License"
  s.platform     = :ios, '10.0'

  s.source       = { :git => ""}

  # s.source_files  = 'ios/src/*.{h,m}', '../../../../aepsdk-optimize-ios/Sources/**/*.{h,swift,m}'
  s.requires_arc = true

  s.dependency "React"
  # s.dependency = 'AEPCore'
  # s.vendored_frameworks = 'ios/libs/AEPOptimize.xcframework'
  # s.dependency "AEPOptimize"
  # s.dependency "AEPOptimize","~>1.0"  
end
