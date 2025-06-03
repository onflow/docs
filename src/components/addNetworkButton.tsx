import React, { useEffect, useState } from 'react';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button/index';

const targetChains = [
  {
    id: 747,
    name: 'Flow EVM',
    rpcUrls: ['https://mainnet.evm.nodes.onflow.org'],
    blockExplorerUrls: ['https://evm.flowscan.io/'],
  },
  {
    id: 545,
    name: 'Flow EVM Testnet',
    rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
    blockExplorerUrls: ['https://evm-testnet.flowscan.io/'],
  },
];

export const AddNetworkButton = (): JSX.Element => {
  const [isNetworkAdded, setIsNetworkAdded] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(0); // Flow Testnet

  const getChainId = async (): Promise<void> => {
    if (!window?.ethereum) return;
    const chainId = await window?.ethereum.request({ method: 'eth_chainId' });
    setChainId(parseInt(chainId, 16)); // Convert chainId from hex to decimal
  };

  useEffect(() => {
    getChainId().catch((e) => {
      console.error(e);
    });
  }, []);

  const hasEthereum = window?.ethereum !== undefined;

  useEffect(() => {
    if (targetChains.map(({ id }) => id).includes(chainId)) {
      setIsNetworkAdded(true);
    } else {
      setIsNetworkAdded(false);
    }
  }, [chainId]);

  const addFlowNetwork = async ({
    id,
    name,
    rpcUrls,
    blockExplorerUrls,
  }: {
    id: number;
    name: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
  }): Promise<void> => {
    try {
      // Define your network details here
      await window?.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${id.toString(16)}`, // '0x2eb', // 747 in hexadecimal
            chainName: name,
            rpcUrls,
            iconUrls: [
              'https://assets-global.website-files.com/5f734f4dbd95382f4fdfa0ea/65b016be9b9cf0a402a67a38_ico-flow-crescendo.png',
            ],
            nativeCurrency: {
              name: 'Flow',
              symbol: 'FLOW',
              decimals: 18,
            },
            blockExplorerUrls,
          },
        ],
      });
    } catch (error) {
      console.error('Could not add Flow Testnet', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return hasEthereum ? (
    <div className="flex gap-2 my-5">
      {targetChains.map((chain) => (
        <Button
          key={chain.id}
          disabled={isNetworkAdded}
          onClick={() => {
            addFlowNetwork(chain).catch((e) => {
              console.error(e);
            });
          }}
        >
          {isNetworkAdded
            ? `${chain.name} Network Added!`
            : `Add ${chain.name} Network`}
        </Button>
      ))}
    </div>
  ) : (
    <Button variant="primary" href="https://metamask.io/download/">
      Install MetaMask
    </Button>
  );
};
