import React from 'react';
import { ColorOption, colors } from '@site/src/constants/colors';
import ActionCard from '@site/src/components/ActionCard';
import { useIcons } from '../hooks/use-icons';
import { Icon } from './Icon';

interface ActionCardGridProps {
  title: string;
  id?: string;
  icon?: string;
  iconColor?: ColorOption;
  sections: {
    title?: string;
    cards: {
      heading: string;
      description: string;
      iconColor?: string;
      cardColor?: string;
      icon?: string;
      variant?: 'horizontal' | 'default' | 'overlay';
      onClick?: () => void;
    }[];
  }[];
}

const ActionCardGrid: React.FC<ActionCardGridProps> = ({ title, sections, id, icon, iconColor = 'green' }) => {
  const icons = useIcons();

  return (
    <div className="relative p-8" id={id}>
      {/* Main Title Section */}
      <div className="relative flex items-center mb-8">
        {/* Icon and Line Container */}
        <div className="absolute top-0 left-5 flex flex-col items-center">
          {/* Icon */}
          <div className={`w-10 h-10 ${colors[iconColor].light} flex items-center justify-center rounded-md`}>
            {icon && <Icon name={icon} />}
          </div>
          {/* Vertical Line */}
          <div className={`w-[1px] ${colors[iconColor].light} h-full`}></div>
        </div>
        {/* Title */}
        <h2 className="ml-20 text-3xl font-semibold text-gray-900 dark:text-white font-['Inter']">{title}</h2>
      </div>

      {/* Wrap Cards and Sections in Line Container */}
      <div className="relative pl-8">
        {/* Vertical Line */}
        <div className="absolute top-0 left-10 w-[1px] bg-green-500 h-full"></div>

        {/* Sections */}
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            {/* Section Title */}
            <h3 className="pl-8 text-2xl font-semibold text-white font-['Inter'] mb-4">{section.title}</h3>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-8">
              {section.cards.map((card, cardIndex) => (
                <ActionCard
                  key={`${sectionIndex}-${cardIndex}`}
                  icon={card.icon}
                  iconColor={card.iconColor as ColorOption}
                  cardColor={card.cardColor as ColorOption}
                  heading={card.heading}
                  description={card.description}
                  onClick={card.onClick}
                  variant={card.variant}
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
