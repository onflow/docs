import React from 'react';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button/index';

const tokens = [
  {
    address: '0xF1815bd50389c46847f0Bda824eC8da914045D14',
    symbol: 'USDC',
    decimals: 6,
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
];

const addCustomToken = async (token) => {
  if (!window?.ethereum) {
    alert('MetaMask is required to add custom tokens.');
    return;
  }
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.image,
        },
      },
    });
    if (wasAdded) {
      console.log(`${token.symbol} was added to MetaMask.`);
    } else {
      console.log(`User rejected adding ${token.symbol}.`);
    }
  } catch (error) {
    console.error(`Error adding ${token.symbol}:`, error);
  }
};

export const AddCustomTokenButton = () => {
  return (
    <div className="flex gap-2 my-5">
      {tokens.map((token) => (
        <Button key={token.address} onClick={() => addCustomToken(token)}>
          Add {token.symbol}
        </Button>
      ))}
    </div>
  );
};
