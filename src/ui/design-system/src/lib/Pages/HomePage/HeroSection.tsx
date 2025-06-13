import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto py-6">
      <div className="flex flex-col lg:flex-row items-start justify-between">
        {/* Left: Hero Content */}
        <div className="flex-1 max-w-2xl text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            What do you want to do today?
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 mb-5 max-w-xl">
            Fire up a new app, add blue-chip features such as tokens and NFTs, or supercharge your user experience.<br />
            Access builder credits, startup support, and explore funding opportunities.
          </p>
        </div>
        {/* Right: Placeholder for future content */}
        <div className="flex-1 hidden lg:block" style={{ minHeight: 120 }} />
      </div>
    </section>
  );
};

export default HeroSection; 