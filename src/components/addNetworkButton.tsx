import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonLink,
} from '@site/src/ui/design-system/src/lib/Components/Button/index';

export const AddNetworkButton = () => {
  const targetChainIds = [747, 646, 545]; // Your target chain IDs
  const [isNetworkAdded, setIsNetworkAdded] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string>(''); // Flow Testnet

  const getChainId = async () => {
    if (!window?.ethereum) return;
    const chainId = await window?.ethereum.request({ method: 'eth_chainId' });
    setChainId(parseInt(chainId, 16)); // Convert chainId from hex to decimal
  };

  useEffect(() => {
    getChainId();
  }, []);

  const hasEthereum = window?.ethereum !== undefined;

  useEffect(() => {
    if (targetChainIds.includes(chainId)) {
      setIsNetworkAdded(true);
    } else {
      setIsNetworkAdded(false);
    }
  }, [chainId]);

  const addFlowNetwork = async () => {
    try {
      // Define your network details here
      await window?.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x221',
            chainName: 'Flow Testnet',
            rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
            iconUrls: [
              'https://assets-global.website-files.com/5f734f4dbd95382f4fdfa0ea/65b016be9b9cf0a402a67a38_ico-flow-crescendo.png',
            ],
            nativeCurrency: {
              name: 'Flow',
              symbol: 'FLOW',
              decimals: 18,
           },
            blockExplorerUrls: ['https://evm-testnet.flowscan.io/'],
          },
        ],
      });
    } catch (error) {
      console.error('Could not add Flow Testnet', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return hasEthereum ? (
    <Button
      className="my-5 "
      disabled={isNetworkAdded}
      variant="secondary"
      onClick={addFlowNetwork}
    >
      {isNetworkAdded ? 'Flow Network Added!' : 'Add Flow Network'}
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
