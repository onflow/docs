import React from 'react';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

const WhyFlowSection: React.FC = () => {
  return (
    <section className="container mx-auto pt-8 pb-16">
      <a
        href="/build/flow"
        className="block bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-md p-8 pt-6 pb-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer no-underline hover:no-underline"
        onClick={() => {
          event({
            action: GA_EVENTS.ACTION_CARD_CLICK,
            category: GA_CATEGORIES.ACTION_CARD,
            label: 'Why Flow? - Learn more',
            location: true,
          });
        }}
      >
        <div className="flex flex-col gap-2">
          {/* Heading */}
          <div className="flex items-start">
            <div className="w-1 h-8 bg-[#00E099] mr-3 flex-shrink-0"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight mt-0.5" style={{ fontSize: '20px', fontWeight: 600 }}>
              Why Flow?
            </h2>
          </div>
          
          {/* Body Text and CTA Link */}
          <div className="flex flex-row items-start justify-between gap-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed flex-1 max-w-3xl">
              With <strong>600% YoY TVL growth</strong> to $100M+ and the <strong>safest risk-adjusted yields</strong> for consumers in DeFi, Flow is uniquely positioned to power the future of Consumer DeFi.
            </p>
            
            {/* Right: CTA Link */}
            <div className="inline-flex items-center text-gray-900 dark:text-white font-semibold text-lg hover:text-green-600 dark:hover:text-green-400 transition-colors leading-tight flex-shrink-0">
              Learn more
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </section>
  );
};

export default WhyFlowSection;
