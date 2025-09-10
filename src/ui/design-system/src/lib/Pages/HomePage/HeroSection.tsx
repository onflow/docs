import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

const HeroSection: React.FC = () => {
  const { colorMode } = useColorMode();
  // const calendarSrc = colorMode === 'dark'
  //   ? 'https://lu.ma/embed/calendar/cal-DBqbEn6mwZR13qQ/events?lt=dark'
  //   : 'https://lu.ma/embed/calendar/cal-DBqbEn6mwZR13qQ/events';
  return (
    <section className="container mx-auto py-6">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        {/* Left: Hero Content */}
        <div className="flex-1 max-w-2xl text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Better apps deserve better blockchains
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 mb-4 max-w-xl">
            <strong>Cadence</strong> for whats next. <strong>Solidity</strong> for what you've got. On Flow, both run natively with no tricks and no rewrites.  <strong>Build the next killer app</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <a
              href="/blockchain-development-tutorials/use-AI-to-build-on-flow"
              className="px-6 py-2 rounded-lg bg-primary-purple text-white hover:text-white focus:text-white no-underline hover:no-underline font-bold text-base shadow-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 focus:ring-2 focus:ring-primary-purple transition-colors text-center"
              onClick={() => {
                event({
                  action: GA_EVENTS.ACTION_CARD_CLICK,
                  category: GA_CATEGORIES.ACTION_CARD,
                  label: 'Build with AI',
                  location: true,
                });
              }}
            >
              Build with AI
            </a>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  event({
                    action: GA_EVENTS.ACTION_CARD_CLICK,
                    category: GA_CATEGORIES.ACTION_CARD,
                    label: 'Start with Cadence',
                    location: true,
                  });
                  window.location.href = '/build/cadence/getting-started/contract-interaction';
                }}
                className="px-6 py-2 rounded-lg bg-transparent text-black dark:text-white underline font-bold text-base border-none shadow-none focus:outline-none focus:underline hover:underline hover:text-green-600 dark:hover:text-green-400 transition-colors text-center cursor-pointer"
                style={{ background: 'transparent' }}
              >
                Start with Cadence
              </button>
              <a
                href="/build/flow"
                className="px-6 py-2 rounded-lg bg-transparent text-black dark:text-white underline font-bold text-base border-none shadow-none focus:outline-none focus:underline hover:underline hover:text-green-600 dark:hover:text-green-400 transition-colors text-center"
                onClick={() => {
                  event({
                    action: GA_EVENTS.ACTION_CARD_CLICK,
                    category: GA_CATEGORIES.ACTION_CARD,
                    label: 'Why Flow?',
                    location: true,
                  });
                }}
              >
                Why Flow?
              </a>
            </div>
            {/*
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
            */}
          </div>
        </div>
        {/* Right: Quote */}
        {/* <div className="flex-1 flex justify-end items-start pl-0 lg:pl-8 mt-6 lg:mt-0 w-full lg:w-auto">
          <blockquote className="relative bg-black/40 dark:bg-white/10 border-r-8 border-primary-green-400 pl-4 pr-6 py-4 rounded-lg shadow-lg max-w-md text-white dark:text-gray-100 text-base italic">
            <span className="block mb-2">
              "If all you want to do is what blockchains are doing today, any of the other chains are fine.  Flow is for people who believe this technology can do more."
            </span>
            <span className="block text-base not-italic text-primary-green-300 mt-2">
              - Dieter Shirley, Chief Architect of Flow & co-author of the <a href="https://github.com/ethereum/eips/issues/721" target="_blank" rel="noopener noreferrer" className="underline text-primary-green-200 dark:text-primary-green-400">ERC-721 NFT standard</a>
            </span>
          </blockquote>
        </div> */}
        {/* Right: Calendar card (visible on lg and up) */}
        {/* <div className="flex-1 hidden lg:flex justify-end items-center pl-8">
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
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection; 