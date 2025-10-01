"use strict";

import { useContext } from "react";
import { ContentCardContainerContext } from "../providers/ContentCardContainerProvider.js";
function useContainerSettings() {
  const settings = useContext(ContentCardContainerContext);
  if (!settings) {
    throw new Error("useContainerSettings must be used within a ContentCardContainerProvider");
  }
  return settings;
}
export default useContainerSettings;
//# sourceMappingURL=useContainerSettings.js.map