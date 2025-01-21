import React from 'react';
import { colors, ColorOption } from '@site/src/constants/colors';

interface ActionCardProps {
  iconColor?: ColorOption;
  cardColor?: ColorOption;
  heading: string;
  description: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
    iconColor = 'white',
    cardColor = 'black',
    heading,
    description,
  }) => {
  const cardBg = colors[cardColor].dark;
  const iconBg = colors[iconColor].light;

  return (
    <div className={`p-6 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer ${cardBg}`}>
      <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 ${iconBg}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 black"
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
      <h3 className="text-xl font-semibold text-white mb-2">{heading}</h3>
      <p className="text-sm text-gray-100">{description}</p>
    </div>
  );
};

export default ActionCard;
