import React, { useState } from 'react';
import { event } from '@site/src/utils/gtags.client';
import { useColorMode } from '@docusaurus/theme-common';

const ITEMS = [
  'Increment the Counter',
  'View the Current Count',
  'View NBA Top Shots',
  'Claim Fungible Tokens',
  'Get Current Balance',
  'Mint an NFT',
  'Get NFT Balance',
];

const QuickStartShowcase: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const { colorMode } = useColorMode();

  // Dynamically set colormode in iframe srcs
  const IFRAME_SRCS = [
    'https://run.dnz.dev/snippet/5f856b7f7d89e737?output=horizontal&outputSize=400',
    'https://run.dnz.dev/snippet/a7a18e74d27f691a?output=horizontal&outputSize=400',
    'https://run.dnz.dev/snippet/a7a18e74d27f691a?output=horizontal&outputSize=400',
    'https://run.dnz.dev/snippet/a7a18e74d27f691a?output=horizontal&outputSize=400',
    'https://run.dnz.dev/snippet/a7a18e74d27f691a?output=horizontal&outputSize=400',
    'https://run.dnz.dev/snippet/a7a18e74d27f691a?output=horizontal&outputSize=400',
    'https://run.dnz.dev/snippet/94dfd4b699b7b8ca?output=horizontal&outputSize=400',
  ].map(url => url + `&colormode=${colorMode}`);

  return (
    <section className="container mx-auto pt-1 pb-8 hidden lg:block">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Interact with Cadence Testnet
        </h2>
        <div className="flex gap-3">
          <a
            href="https://wallet.flow.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg bg-green-dark text-white hover:text-white focus:text-white no-underline hover:no-underline font-bold text-base shadow-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 focus:ring-2 focus:ring-green-dark transition-colors text-center"
            onClick={() => {
              event({
                action: 'action_card_click',
                category: 'action_card',
                label: 'Flow Wallet',
                location: true,
              });
            }}
          >
            Flow Wallet
          </a>
          <a
            href="https://faucet.flow.com/fund-account"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-lg bg-green-dark text-white hover:text-white focus:text-white no-underline hover:no-underline font-bold text-base shadow-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 focus:ring-2 focus:ring-green-dark transition-colors text-center"
            onClick={() => {
              event({
                action: 'action_card_click',
                category: 'action_card',
                label: 'Flow Faucet',
                location: true,
              });
            }}
          >
            Flow Faucet
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center min-h-[400px]">
        {/* Left: Selector */}
        <div className="flex flex-col w-full items-center justify-center">
          <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex flex-col gap-3 shadow-sm h-[400px] justify-center" style={{ maxWidth: 320 }}>
            {ITEMS.map((item, idx) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSelected(idx);
                  event({
                    action: 'action_card_click',
                    category: 'action_card',
                    label: item,
                    location: true,
                  });
                }}
                className={`w-full text-left px-4 py-3 transition font-medium text-base
                  ${selected === idx
                    ? 'bg-white dark:bg-gray-900 rounded-xl shadow text-primary-green-600 font-bold'
                    : 'text-gray-900 dark:text-gray-100 bg-transparent'} cursor-pointer`
                }
                style={{ outline: 'none', border: 'none' }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {/* Right: Iframe (spans 2 columns) */}
        <div className="lg:col-span-2 flex items-center justify-end w-full">
          <iframe
            key={selected}
            sandbox="allow-scripts allow-same-origin"
            className="flow-runner-iframe rounded-2xl shadow-lg border border-gray-200"
            src={IFRAME_SRCS[selected]}
            width="100%"
            height="400px"
            title="Flow Runner Quickstart"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default QuickStartShowcase; 