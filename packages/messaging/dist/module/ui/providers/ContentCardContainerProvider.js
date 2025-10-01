"use strict";

import React, { createContext } from "react";
export const ContentCardContainerContext = /*#__PURE__*/createContext(null);
function ContentCardContainerProvider({
  children,
  settings
}) {
  return /*#__PURE__*/React.createElement(ContentCardContainerContext.Provider, {
    value: settings
  }, children);
}
export default ContentCardContainerProvider;
//# sourceMappingURL=ContentCardContainerProvider.js.map