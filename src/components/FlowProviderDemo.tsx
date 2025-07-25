import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useColorMode } from '@docusaurus/theme-common';
import { FlowProvider } from '@onflow/react-sdk';
import { flowClient } from '@site/src/config/fcl';

interface FlowProviderDemoProps {
  children: React.ReactNode;
}

export default function FlowProviderDemo({
  children,
}: FlowProviderDemoProps): React.ReactElement | null {
  const isBrowser = useIsBrowser();
  const { colorMode } = useColorMode();

  if (!isBrowser) return null;

  return (
    <FlowProvider flowClient={flowClient} colorMode={colorMode}>
      {children}
    </FlowProvider>
  );
}
