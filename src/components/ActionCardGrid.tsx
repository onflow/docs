import React from 'react';
import { ColorOption } from '@site/src/constants/colors';
import ActionCard from '@site/src/components/ActionCard';

interface ActionCardGridProps {
  title: string;
  sections: {
    title: string;
    cards: {
      heading: string;
      description: string;
      iconColor?: string;
      cardColor?: string;
    }[];
  }[];
}

const ActionCardGrid: React.FC<ActionCardGridProps> = ({ title, sections }) => {
  return (
    <div className="relative p-8">
      {/* Main Title Section */}
      <div className="flex items-center mb-8">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        </div>
        {/* Title */}
        <h2 className="text-3xl font-semibold text-white">{title}</h2>
      </div>

      {/* Wrap Cards and Sections in Line Container */}
      <div className="relative pl-8">
        {/* Vertical Line */}
        <div className="absolute top-0 left-6 w-1 bg-green-500 h-full"></div>

        {/* Sections */}
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            {/* Section Title */}
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">{section.title}</h3>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.cards.map((card, cardIndex) => (
                <ActionCard
                  key={`${sectionIndex}-${cardIndex}`}
                  iconColor={card.iconColor as ColorOption}
                  cardColor={card.cardColor as ColorOption}
                  heading={card.heading}
                  description={card.description}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionCardGrid;
