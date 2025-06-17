import React from 'react';
import Icon from '../../../../../../components/Icon';
import Tooltip from './Tooltip';
import { ColorOption } from '@site/src/constants/colors';

interface CardData {
  heading: string;
  description: string;
  iconColor?: string;
  cardColor?: string;
  icon?: string;
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
  return (
    <section className="container mx-auto pt-1 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col h-full items-start">
            {section.title && (
              <>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">{section.title}</h3>
                {section.subtext && (
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">{section.subtext}</p>
                )}
              </>
            )}
            <div className="flex flex-col w-full gap-3">
              {section.cards.map((card, cardIdx) => (
                <Tooltip key={cardIdx} description={card.description}>
                  <a
                    href={card.href}
                    target={card.target}
                    rel={card.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 text-base text-gray-900 dark:text-gray-100 no-underline hover:no-underline transition-colors"
                  >
                    <span className="flex items-center justify-center w-6 h-6 mr-2 shrink-0">
                      {card.icon && <Icon name={card.icon} className="w-6 h-6 flex-none text-gray-900 dark:text-white" />}
                    </span>
                    <span className="font-medium">{card.heading}</span>
                  </a>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection; 