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
  const allCards = sections.flatMap(section => section.cards);
  
  return (
    <section className="container mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allCards.map((card, cardIdx) => (
          <Tooltip key={cardIdx} description={card.description}>
            <a
              href={card.href}
              target={card.target}
              rel={card.target === '_blank' ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#00EF8B] dark:hover:border-[#00EF8B] transition-colors duration-200 cursor-pointer no-underline hover:no-underline"
              onClick={(e) => {
                event({
                  action: GA_EVENTS.ACTION_CARD_CLICK,
                  category: GA_CATEGORIES.ACTION_CARD,
                  label: card.heading,
                  location: true,
                });
              }}
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                {card.icon && <Icon name={card.icon} className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
              </span>
              
              <span className="flex-1 font-medium text-gray-900 dark:text-white">{card.heading}</span>
              
              <span className="text-gray-400 group-hover:text-[#00EF8B] transition-colors duration-200">
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