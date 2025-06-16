import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

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
            What do you want to build today?
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 mb-5 max-w-xl">
            Flow was built by consumer-facing, onchain app developers to solve the problem of building consumer-facing, onchain apps. Dieter Shirley, Chief Architect of Flow and co-author of the <a href="https://github.com/ethereum/eips/issues/721" target="_blank" rel="noopener noreferrer" className="underline text-primary-green-600 dark:text-primary-green-400">ERC-721 NFT standard</a> calls it:
          </p>
          <blockquote className="mt-4 pl-4 border-l-4 border-primary-green-500 italic text-gray-900 dark:text-gray-100">
            A computer that anyone can use, everyone can trust, and no one can shut down.
          </blockquote>
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