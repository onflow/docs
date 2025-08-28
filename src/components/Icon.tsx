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
  const [icon, setIcon] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const icons = useIcons();

  React.useEffect(() => {
    if (!name) return;

    const loadIcon = async () => {
      setLoading(true);
      try {
        const iconData = await icons.loadIcon(name);
        setIcon(iconData);
      } catch (error) {
        console.warn(`Failed to load icon: ${name}`, error);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [name, icons]);

  if (!name) { return <LocationIcon />; }
  if (loading) { return <div className={className}><div className="w-full h-full bg-gray-200 animate-pulse rounded" /></div>; }
  if (!icon) { return <LocationIcon />; }

  // Check if it's a static path (string) or a React component
  if (typeof icon === 'string') {
    return (
      <div className={className}>
        <img 
          src={icon} 
          alt={name}
          className="w-full h-full object-contain dark:brightness-0 dark:invert"
          width={width}
          height={height}
        />
      </div>
    );
  }

  // Otherwise, render as a React component
  return (
    <div className={className}>
      {React.createElement(icon, {
        width,
        height,
        className: "w-full h-full",
        title: name,
        role: "img",
        "aria-label": name
      })}
    </div>
  );
};

export default Icon;
