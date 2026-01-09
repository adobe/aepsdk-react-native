"use strict";

import { useContext } from "react";
import { ContentCardContainerContext } from "../providers/ContentCardContainerProvider.js";
function useContainerSettings() {
  const settings = useContext(ContentCardContainerContext);
  return settings;
}
export default useContainerSettings;
//# sourceMappingURL=useContainerSettings.js.map