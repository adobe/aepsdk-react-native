import { useContext } from "react";
import { InboxContext, InboxSettings } from "../providers/InboxProvider";

function useInboxSettings(): InboxSettings | null {
  const settings = useContext(InboxContext);
  return settings;
}

export default useInboxSettings;