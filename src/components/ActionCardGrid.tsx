import React from 'react';
import ActionCard from '@site/src/components/ActionCard';
import { ColorOption } from '@site/src/constants/colors';

interface ActionCardGridProps {
  title: string;
  sections: {
    title: string;
    cards: {
      heading: string;
      description: string;
      iconColor?: ColorOption;
      cardColor?: ColorOption;
    }[];
  }[];
}

const ActionCardGrid: React.FC<ActionCardGridProps> = ({ title, sections }) => {
  return (
    <div className="p-8">
      {/* Main Title */}
      <h2 className="text-3xl font-semibold text-white mb-6">{title}</h2>

      {/* Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.cards.map((card, cardIndex) => (
              <ActionCard
                key={`${sectionIndex}-${cardIndex}`}
                iconColor={card.iconColor}
                cardColor={card.cardColor}
                heading={card.heading}
                description={card.description}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionCardGrid;
