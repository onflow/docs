import React from 'react';
import { colors, ColorOption } from '@site/src/constants/colors';
import { Icon } from './Icon';

interface ActionCardProps {
  icon?: string;
  iconColor?: ColorOption;
  cardColor?: ColorOption;
  heading: string;
  description: string;
  onClick?: () => void;
  variant?: 'default' | 'overlay' | 'horizontal';
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  iconColor = 'white',
  cardColor = 'black',
  heading,
  description,
  onClick,
  variant = 'default',
}) => {
  const cardBg = colors[cardColor].dark;
  const iconBg = colors[iconColor].light;

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between p-6 rounded-lg shadow-lg hover:scale-[1.02] transition-transform ${variant === 'overlay' ? 'mt-6' : ''
        } ${onClick ? 'cursor-pointer' : ''} ${cardBg}`}
    >
      {variant === 'overlay' && (
        <div
          className={`absolute -top-5 left-6 w-10 h-10 rounded-md flex items-center justify-center ${iconBg}`}
        >
          <Icon name={icon} />
        </div>
      )}
      <div className="flex flex-col h-full">
        {variant === 'default' && (
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 ${iconBg}`}
          >
            <Icon name={icon} />
          </div>
        )}
        {variant === 'horizontal' && (
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`shrink-0 w-10 h-10 rounded-md flex items-center justify-center ${iconBg}`}
            >
              <Icon name={icon} />
            </div>
            <div className="flex flex-col justify-center min-h-[40px] pt-1.5">
              <h3 className="text-2xl font-semibold text-white">{heading}</h3>
            </div>
          </div>
        )}
        {variant !== 'horizontal' && (
          <div className={variant === 'overlay' ? 'mt-6' : ''}>
            <h3 className="text-2xl font-semibold text-white mb-2">{heading}</h3>
            <p className="text-sm text-gray-100">{description}</p>
          </div>
        )}
        {variant === 'horizontal' && (
          <p className="text-sm text-gray-100">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ActionCard;