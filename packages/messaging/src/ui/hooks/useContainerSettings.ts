import { useContext } from "react";
import { ContentCardContainerContext, ContainerSettings } from "../providers/ContentCardContainerProvider";

function useContainerSettings(): ContainerSettings | null {
  const settings = useContext(ContentCardContainerContext);
  return settings;
}

export default useContainerSettings;