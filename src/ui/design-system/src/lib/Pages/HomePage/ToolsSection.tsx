import React from 'react';
import { toolsGridData } from './GridData/ToolsGridData';
import Icon from '../../../../../../components/Icon';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

const ToolsSection: React.FC = () => {
  const cards = toolsGridData.sections[0].cards;

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 py-10 border border-green-100 dark:border-green-900">
          <div className="flex items-baseline mb-8">
            <span className="flex items-center justify-center w-10 h-10 rounded-md bg-green-500 mr-3">
              <Icon name={toolsGridData.icon} className="w-6 h-6 text-white" />
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <a
                key={idx}
                href={card.href}
                {...(typeof (card as any).target === 'string' ? { target: (card as any).target, rel: (card as any).target === '_blank' ? 'noopener noreferrer' : undefined } : {})}
                className="flex flex-col items-start bg-green-50 dark:bg-green-950 rounded-xl p-6 shadow hover:shadow-lg transition group h-full border border-green-100 dark:border-green-800 hover:border-green-400 dark:hover:border-green-400 hover:underline hover:decoration-green-500 dark:hover:decoration-white"
                onClick={(e) => {
                  event({
                    action: GA_EVENTS.ACTION_CARD_CLICK,
                    category: GA_CATEGORIES.ACTION_CARD,
                    label: card.heading,
                    location: true,
                  });
                }}
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-green-100 dark:bg-green-800 mb-4">
                  {card.icon && <Icon name={card.icon} className="w-6 h-6 text-green-700 dark:text-green-200" />}
                </span>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-300">{card.heading}</h3>
                <p className="text-sm text-green-800 dark:text-green-300">{card.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
