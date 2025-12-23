import React from 'react';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

const WhyFlowSection: React.FC = () => {
  return (
    <section className="container mx-auto pb-12">
      <a
        href="/build/flow"
        className="group block bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-800 dark:border-gray-700 hover:border-[#00EF8B]/50 transition-colors duration-200 cursor-pointer no-underline hover:no-underline"
        onClick={() => {
          event({
            action: GA_EVENTS.ACTION_CARD_CLICK,
            category: GA_CATEGORIES.ACTION_CARD,
            label: 'Why Flow? - Learn more',
            location: true,
          });
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-[#00EF8B] rounded-full"></div>
              <h2 className="text-xl font-semibold text-white">
                Why Flow?
              </h2>
            </div>
            
            <p className="text-base text-gray-300 leading-relaxed max-w-2xl">
              With <strong className="text-white">600% YoY TVL growth</strong> to $100M+ and the <strong className="text-white">safest risk-adjusted yields</strong> for consumers in DeFi, Flow is uniquely positioned to power the future of Consumer DeFi.
            </p>
          </div>
          
          <div className="flex items-center text-[#00EF8B] font-medium group-hover:gap-3 gap-2 transition-all duration-200 shrink-0">
            Learn more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>
    </section>
  );
};

export default WhyFlowSection;
