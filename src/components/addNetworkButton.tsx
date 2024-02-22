import React from 'react';
import {
  Button,
  ButtonLink,
} from '@site/src/ui/design-system/src/lib/Components/Button/index';

export const AddNetworkButton = () => {
  const hasEthereum = window?.ethereum !== undefined;

  const addFlowEVM = async () => {
    try {
      // Define your network details here
      await window?.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x29a',
            chainName: 'Flow',
            rpcUrls: ['https://crescendo.evm.nodes.onflow.org'],
            iconUrls: [
              'https://assets-global.website-files.com/5f734f4dbd95382f4fdfa0ea/65b016be9b9cf0a402a67a38_ico-flow-crescendo.png',
            ],
            nativeCurrency: {
              name: 'Flow',
              symbol: 'FLOW',
              decimals: 18,
            },
            blockExplorerUrls: ['https://crescendo.flowdiver.io/'],
          },
        ],
      });
    } catch (error) {
      console.error('Could not add Flow EVM', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return hasEthereum ? (
    <Button className="my-5 " variant="secondary" onClick={addFlowEVM}>
      Add Flow EVM Network
    </Button>
  ) : (
    <ButtonLink
      className="my-5"
      variant="primary"
      href="https://metamask.io/download/"
    >
      Install MetaMask
    </ButtonLink>
  );
};
