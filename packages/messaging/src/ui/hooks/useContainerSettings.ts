import { useContext } from "react";
import { ContentCardContainerContext } from "../providers/ContentCardContainerProvider";

function useContainerSettings() {
  const settings = useContext(ContentCardContainerContext);
  if (!settings) {
    throw new Error("useContainerSettings must be used within a ContentCardContainerProvider");
  }
  return settings;
}

export default useContainerSettings;