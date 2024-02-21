import React from 'react';

const AddNetworkButton = () => {
  const addFlowEVM = async () => {
    try {
      // Define your network details here
      await window?.ethereum.request({
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
            blockExplorerUrls: ['https://blockscout.com/poa/xdai/'],
          },
        ],
      });
    } catch (error) {
      console.error('Could not add Flow EVM', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return <button onClick={addFlowEVM}>Add Flow EVM</button>;
};

export default AddNetworkButton;
