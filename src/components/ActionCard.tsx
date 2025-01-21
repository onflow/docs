import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

type ColorOption = 'pink' | 'green' | 'blue' | 'purple' | 'black';

interface ActionCardProps {
  iconColor: ColorOption;
  cardColor?: ColorOption;
  headingColor: ColorOption;
  heading: string;
  description: string;
}

const colorStyles: Record<ColorOption, { iconBg: string; cardBg: string; headingColor: string }> = {
  pink: {
    iconBg: 'bg-pink-500',
    cardBg: 'bg-pink-600',
    headingColor: 'text-white',
  },
  green: {
    iconBg: 'bg-green-500',
    cardBg: 'bg-green-600',
    headingColor: 'text-white',
  },
  blue: {
    iconBg: 'bg-blue-500',
    cardBg: 'bg-blue-600',
    headingColor: 'text-white',
  },
  purple: {
    iconBg: 'bg-purple-500',
    cardBg: 'bg-purple-600',
    headingColor: 'text-white',
  },
  black: {
    iconBg: 'bg-gray-900',
    cardBg: 'bg-gray-800',
    headingColor: 'text-white',
  },
};

const ActionCard: React.FC<ActionCardProps> = ({
    iconColor,
    cardColor = 'black',
    headingColor,
    heading,
    description,
  }) => {
  const cardBg = colorStyles[cardColor].cardBg;
  const iconBg = colorStyles[iconColor].iconBg;
  const headingTextColor = colorStyles[headingColor].headingColor;

  return (
    <div
      className={`p-6 rounded-lg shadow-lg text-white hover:scale-105 transition-transform cursor-pointer ${cardBg}`}
    >
      <div
        className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 ${iconBg}`}
      >
        <FontAwesomeIcon icon={faLocationDot} size="lg" />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${headingTextColor}`}>{heading}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};

export default ActionCard;
