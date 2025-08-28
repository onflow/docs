import React from 'react';
import { useIcons } from '../hooks/use-icons';

const LocationIcon = () => (
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
);

interface IconProps {
  name?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  className = "w-6 h-6",
  width = "100%",
  height = "100%"
}) => {
  const icons = useIcons();

  if (!name) { return <LocationIcon />; }

  // Get icon path
  const iconPath = icons.loadIcon(name);

  if (!iconPath) { return <LocationIcon />; }

  // Always render as an image since we're using static paths
  return (
    <div className={className}>
      <img 
        src={iconPath} 
        alt={name}
        className="w-full h-full object-contain dark:brightness-0 dark:invert"
        width={width}
        height={height}
      />
    </div>
  );
};

export default Icon;
