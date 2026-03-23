require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCTAEPOptimize"
  s.version      = package["version"]
  s.summary      = "TurboModule wrapper for AEP Optimize"
  s.author       = "Adobe Experience Platform SDK Team"
  s.homepage     = "https://github.com/adobe/aepsdk-react-native"
  s.license      = "Apache 2.0 License"



  s.platform     = :ios, "12.0"
  s.requires_arc = true

  s.source       = { :path => "." }

  s.source_files = "ios/**/*.{h,mm}"

  s.dependency "React-Codegen"
  s.dependency "React"
  s.dependency "AEPOptimize", ">= 5.0.0", "< 6.0.0"

  s.pod_target_xcconfig = {
    "CLANG_ENABLE_MODULES" => "YES",
    "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules"
  }
end