import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

interface ActionCardProps {
  color: 'pink' | 'green' | 'blue';
  heading: string;
  description: string;
}

const colorStyles: Record<
  string,
  { iconBg: string; cardBg: string; headingColor: string }
> = {
  pink: {
    iconBg: 'bg-pink-500',
    cardBg: 'bg-gray-800',
    headingColor: 'text-pink-300',
  },
  green: {
    iconBg: 'bg-green-500',
    cardBg: 'bg-gray-800',
    headingColor: 'text-green-300',
  },
  blue: {
    iconBg: 'bg-blue-500',
    cardBg: 'bg-gray-800',
    headingColor: 'text-blue-300',
  },
};

const ActionCard: React.FC<ActionCardProps> = ({ color, heading, description }) => {
  const styles = colorStyles[color];

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${styles.cardBg} text-white hover:scale-105 transition-transform cursor-pointer`}
    >
      <div
        className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 ${styles.iconBg}`}
      >
        <FontAwesomeIcon icon={faLocationDot} size="lg" />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${styles.headingColor}`}>{heading}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default ActionCard;