import React from "react";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { FlowProvider } from "@onflow/react-sdk";
import { flowKitConfig } from "@site/src/config/fcl";

export default function FlowProviderDemo({ children }) {
  const isBrowser = useIsBrowser();
  if (!isBrowser) return null;

  return (
    <FlowProvider config={flowKitConfig}>
      {children}
    </FlowProvider>
  );
} 