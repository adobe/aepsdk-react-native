"use strict";

import { useContext } from "react";
import { InboxContext } from "../providers/InboxProvider.js";
function useInboxSettings() {
  const settings = useContext(InboxContext);
  return settings;
}
export default useInboxSettings;
//# sourceMappingURL=useInboxSettings.js.map