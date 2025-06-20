import React, { useState } from 'react';
import { event } from '@site/src/utils/gtags.client';
import { useColorMode } from '@docusaurus/theme-common';

const ITEMS = [
  'Increment the counter',
  'View the current count',
  'Mint tokens and NFTs',
  'Query token balances',
  'Query for NBA Top Shots',
  'Run an EVM transaction',
];

const QuickStartShowcase: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const { colorMode } = useColorMode();

  // Dynamically set colormode in iframe srcs
  const IFRAME_SRCS = [
    'https://run.dnz.dev/snippet/d4248ed6adf216f6?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/a7a18e74d27f691a?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/a7a18e74d27f691a?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/30fbfc406fcfc316?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/9852f5b5a3218637?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/94dfd4b699b7b8ca?output=vertical&outputSize=100',
  ].map(url => url + `&colormode=${colorMode}`);

  return (
    <section className="container mx-auto pt-1 pb-8 hidden lg:block">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Interact with testnet
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Left: Selector */}
        <div className="flex flex-col w-full items-center justify-center bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700">
          <div className="w-full p-4 flex flex-col gap-3 h-[400px] justify-center" style={{ maxWidth: 320 }}>
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
                    ? 'bg-white dark:bg-gray-900 rounded-xl shadow-sm text-primary-green-600 font-bold'
                    : 'text-gray-900 dark:text-gray-100 bg-transparent'} cursor-pointer hover:bg-white/50 dark:hover:bg-gray-900/50`
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
            className="flow-runner-iframe w-full h-[400px]"
            src={IFRAME_SRCS[selected]}
            title="Flow Runner Quickstart"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default QuickStartShowcase; 