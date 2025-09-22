import React, { createContext } from "react";

export type ContainerSettings = {
  cardHeight: number;
};

export const ContentCardContainerContext =
  createContext<ContainerSettings | null>(null);

export interface ContentCardContainerProviderProps {
  children: React.ReactNode;
  settings: ContainerSettings;
}

function ContentCardContainerProvider({
  children,
  settings,
}: ContentCardContainerProviderProps) {
  return (
    <ContentCardContainerContext.Provider value={settings}>
      {children}
    </ContentCardContainerContext.Provider>
  );
}

export default ContentCardContainerProvider;
