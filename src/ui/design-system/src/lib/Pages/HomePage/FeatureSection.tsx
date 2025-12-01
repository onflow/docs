import React from 'react';
import Icon from '../../../../../../components/Icon';
import Tooltip from './Tooltip';
import { ColorOption } from '@site/src/constants/colors';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';
import { IconName } from '@site/src/types/icons';

interface CardData {
  heading: string;
  description: string;
  iconColor?: string;
  cardColor?: string;
  icon?: IconName;
  variant?: string;
  href: string;
  target?: string;
}

interface Section {
  title?: string;
  subtext?: string;
  cards: CardData[];
}

interface FeatureSectionProps {
  title?: string;
  icon?: string;
  iconColor?: ColorOption;
  sections: Section[];
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ sections }) => {
  // Flatten all cards from all sections into a single array
  const allCards = sections.flatMap(section => section.cards);
  
  return (
    <section className="container mx-auto pt-1 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allCards.map((card, cardIdx) => (
          <Tooltip key={cardIdx} description={card.description}>
            <a
              href={card.href}
              target={card.target}
              rel={card.target === '_blank' ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-lg hover:shadow-md transition-all duration-200 cursor-pointer no-underline hover:no-underline h-full min-h-[80px]"
              onClick={(e) => {
                event({
                  action: GA_EVENTS.ACTION_CARD_CLICK,
                  category: GA_CATEGORIES.ACTION_CARD,
                  label: card.heading,
                  location: true,
                });
              }}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors shrink-0">
                {card.icon && <Icon name={card.icon} className="w-5 h-5 flex-none text-green-600 dark:text-green-400" />}
              </span>
              <div className="flex-1">
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{card.heading}</span>
              </div>
              <span className="text-gray-400 group-hover:text-green-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          </Tooltip>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection; 