import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto pt-20 pb-16">
      <div className="flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-gray-900 dark:text-white">
            Turn decentralized finance into personal finance.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-gray-900 dark:text-white font-semibold">Flow</strong> is the leading consumer layer-one network,
            trusted by 1 million monthly active users. Chosen by top global brands
            like NBA, Disney, PayPal, NFL, and Ticketmaster,
            it is the foundation for the next generation of consumer finance:{" "}
            <strong className="text-gray-900 dark:text-white font-semibold">global, always-on, and in real-time.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/blockchain-development-tutorials/forte"
              className="px-7 py-3 rounded-full bg-[#00EF8B] hover:bg-[#00D67D] text-black no-underline hover:no-underline font-semibold text-base transition-colors duration-200 text-center"
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
              className="px-7 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-base border-none hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 text-center cursor-pointer"
            >
              Quickstart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 