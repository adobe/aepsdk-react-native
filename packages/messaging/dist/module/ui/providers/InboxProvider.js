"use strict";

import React, { createContext } from "react";
export const InboxContext = /*#__PURE__*/createContext(null);
function InboxProvider({
  children,
  settings
}) {
  return /*#__PURE__*/React.createElement(InboxContext.Provider, {
    value: settings
  }, children);
}
export default InboxProvider;
//# sourceMappingURL=InboxProvider.js.map