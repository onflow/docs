import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
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
        <FontAwesomeIcon icon={faLocationDot} size="lg" className="text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{heading}</h3>
      <p className="text-sm text-gray-100">{description}</p>
    </div>
  );
};

export default ActionCard;
