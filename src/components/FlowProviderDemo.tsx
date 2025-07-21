import React from "react";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { FlowProvider } from "@onflow/react-sdk";
import { flowClient, flowKitConfig } from "@site/src/config/fcl";

export default function FlowProviderDemo({ children }) {
  const isBrowser = useIsBrowser();
  if (!isBrowser) return null;

  return (
    <FlowProvider flowClient={flowClient}>
      {children}
    </FlowProvider>
  );
} 