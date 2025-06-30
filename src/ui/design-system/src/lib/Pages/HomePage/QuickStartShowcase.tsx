import React, { useState } from 'react';
import { event } from '@site/src/utils/gtags.client';
import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';

const ITEMS = [
  'Flow token account balance',
  'Account storage limit and usage',
  'Onchain counter current count',
  'Balance of custom token',
  'View child accounts',
  'NBA Top Shot and NFL All Day',
];

const QuickStartShowcase: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const { colorMode } = useColorMode();

  // Dynamically set colormode in iframe srcs
  const IFRAME_SRCS = [
    'https://run.dnz.dev/snippet/858e7730fc6b559c?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/80bc251373aed16f?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/5489a3dd7d7650c5?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/30fbfc406fcfc316?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/535ba09dd2d562e2?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/9852f5b5a3218637?output=vertical&outputSize=100',
  ].map(url => url + `&colormode=${colorMode}`);

  return (
    <section className="container mx-auto pt-1 pb-8 hidden lg:block">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
           Query onchain data
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
                className={clsx(
                  "w-full text-left px-4 py-3 transition font-medium text-base cursor-pointer hover:bg-white/50 dark:hover:bg-gray-900/50",
                  selected === idx
                    ? "bg-white dark:bg-gray-900 rounded-xl shadow-sm text-primary-green-600 font-bold"
                    : "text-gray-900 dark:text-gray-100 bg-transparent"
                )}
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