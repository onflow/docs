import React from 'react';

interface CardProps {
  title: string;
  description: string;
  logo: string;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  logo,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
    >
      <div className="p-6 space-y-4">
        <div className="h-24 w-full mb-4 flex items-center justify-center">
          <div className="h-16 transform group-hover:scale-110 transition-transform duration-300">
            <img
              src={logo}
              alt={`${title} logo`}
              className="h-full w-auto object-contain"
              style={{ maxHeight: '64px' }}
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};
