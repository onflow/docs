import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { event } from '@site/src/utils/gtags.client';

const HeroSection: React.FC = () => {
  const { colorMode } = useColorMode();
  const calendarSrc = colorMode === 'dark'
    ? 'https://lu.ma/embed/calendar/cal-DBqbEn6mwZR13qQ/events?lt=dark'
    : 'https://lu.ma/embed/calendar/cal-DBqbEn6mwZR13qQ/events';
  return (
    <section className="container mx-auto py-6">
      <div className="flex flex-col lg:flex-row items-start justify-between">
        {/* Left: Hero Content */}
        <div className="flex-1 max-w-2xl text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Build on the chain made for app builders, by app builders
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 mb-2 max-w-xl">
            Flow is a scalable Layer 1 blockchain designed for modern apps. Start building with <strong>Cadence</strong>, <strong>Solidity (EVM)</strong>, or <strong>AI-powered tools</strong> - each path is first-class and fully supported.
          </p>
          <p className="text-sm italic text-gray-600 dark:text-gray-300 mb-4 max-w-xl">
            "A computer that anyone can use, everyone can trust, and no one can shut down." - Dieter Shirley, Chief Architect of Flow & co-author of the <a href="https://github.com/ethereum/eips/issues/721" target="_blank" rel="noopener noreferrer" className="underline text-primary-green-600 dark:text-primary-green-400">ERC-721 NFT standard</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <a
              href="/build/getting-started/contract-interaction"
              className="px-6 py-2 rounded-lg bg-green-dark text-white hover:text-white focus:text-white no-underline hover:no-underline font-bold text-base shadow-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 focus:ring-2 focus:ring-green-dark transition-colors text-center"
              onClick={() => {
                event({
                  action: 'action_card_click',
                  category: 'action_card',
                  label: 'Cadence App Quickstart',
                  location: true,
                });
              }}
            >
              Cadence App Quickstart
            </a>
            <a
              href="/evm/quickstart"
              className="px-6 py-2 rounded-lg bg-primary-blue text-white hover:text-white focus:text-white no-underline hover:no-underline font-bold text-base shadow-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 focus:ring-2 focus:ring-primary-blue transition-colors text-center"
              onClick={() => {
                event({
                  action: 'action_card_click',
                  category: 'action_card',
                  label: 'Solidity on Flow',
                  location: true,
                });
              }}
            >
              Solidity on Flow
            </a>
            <a
              href="/tutorials/ai-plus-flow"
              className="px-6 py-2 rounded-lg bg-primary-purple text-white hover:text-white focus:text-white no-underline hover:no-underline font-bold text-base shadow-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 focus:ring-2 focus:ring-primary-purple transition-colors text-center"
              onClick={() => {
                event({
                  action: 'action_card_click',
                  category: 'action_card',
                  label: 'Build with AI',
                  location: true,
                });
              }}
            >
              Build with AI
            </a>
          </div>
        </div>
        {/* Right: Calendar card (visible on lg and up) */}
        <div className="flex-1 hidden lg:flex justify-end items-center pl-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 w-[560px] max-w-full flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upcoming Events</h3>
            <iframe
              src={calendarSrc}
              width="520"
              height="260"
              frameBorder="0"
              style={{ border: '1px solid #bfcbda88', borderRadius: 8 }}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
              title="Flow Events Calendar"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 