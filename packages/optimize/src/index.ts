import NativeAEPOptimize from "./NativeAEPOptimize";
export function extensionVersion(): Promise<string> {
  return Promise.resolve(NativeAEPOptimize.extensionVersion());
}