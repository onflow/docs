import React from 'react';
import { growGridData } from './GridData/GrowGridData';
import Icon from '../../../../../../components/Icon';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

const GrowSection: React.FC = () => {
  const cards = growGridData.sections[0].cards;

  return (
    <section className="pb-12">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#A855F7]">
            <Icon name={growGridData.icon} className="w-5 h-5 text-white" />
          </span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Builder toolkit to start, grow, and win</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, idx) => (
            <a
              key={idx}
              href={card.href}
              {...(typeof (card as any).target === 'string' ? { target: (card as any).target, rel: (card as any).target === '_blank' ? 'noopener noreferrer' : undefined } : {})}
              className="group flex flex-col p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#A855F7] dark:hover:border-[#A855F7] transition-colors duration-200 no-underline hover:no-underline"
              onClick={(e) => {
                event({
                  action: GA_EVENTS.ACTION_CARD_CLICK,
                  category: GA_CATEGORIES.ACTION_CARD,
                  label: card.heading,
                  location: true,
                });
              }}
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
                {card.icon && <Icon name={card.icon} className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
              </span>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{card.heading}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{card.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowSection; 