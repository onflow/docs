import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

const HeroSection: React.FC = () => {
  // const { colorMode } = useColorMode();
  // const calendarSrc = colorMode === 'dark'
  //   ? 'https://lu.ma/embed/calendar/cal-DBqbEn6mwZR13qQ/events?lt=dark'
  //   : 'https://lu.ma/embed/calendar/cal-DBqbEn6mwZR13qQ/events';
  return (
    <section className="container mx-auto pt-16 pb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        {/* Left: Hero Content */}
        <div className="flex-1 max-w-2xl text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Turn decentralized finance into just personal finance.
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 mb-4 max-w-xl">
            <strong>Flow</strong> is the leading consumer layer-one network,
            trusted by 1 million monthly active users. Built in collaboration with top global brands
            like NBA, Disney, PayPal, NFL, and Ticketmaster,
            it is the foundation for the next generation of consumer finance:{" "}
            <strong>global, always-on, and in real-time.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <a
              href="/blockchain-development-tutorials/forte"
              className="px-6 py-2 rounded-lg bg-primary-purple text-white hover:text-white focus:text-white no-underline hover:no-underline font-bold text-base shadow-lg border border-gray-200 dark:border-gray-700 hover:opacity-90 focus:ring-2 focus:ring-primary-purple transition-colors text-center"
              onClick={() => {
                event({
                  action: GA_EVENTS.ACTION_CARD_CLICK,
                  category: GA_CATEGORIES.ACTION_CARD,
                  label: 'Automate DeFi',
                  location: true,
                });
              }}
            >
              Automate DeFi
            </a>
            <button
              type="button"
              onClick={() => {
                event({
                  action: GA_EVENTS.ACTION_CARD_CLICK,
                  category: GA_CATEGORIES.ACTION_CARD,
                  label: 'Quickstart',
                  location: true,
                });
                window.location.href = '/blockchain-development-tutorials/cadence/getting-started';
              }}
              className="px-6 py-2 rounded-lg bg-transparent text-black dark:text-white underline font-bold text-base border-none shadow-none focus:outline-none focus:underline hover:underline hover:text-green-600 dark:hover:text-green-400 transition-colors text-center cursor-pointer"
              style={{ background: 'transparent' }}
            >
              Quickstart
            </button>
          </div>
        </div>
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