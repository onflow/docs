import React from 'react';
import clsx from 'clsx';

const BASE_CLASSES =
  'block w-full border px-4 py-2 text-sm transition focus:outline-none rounded-md shadow-sm';

const VARIANTS = {
  primary: `
    bg-gray-200 text-gray-900 border-gray-300
    focus:ring-blue-500 focus:border-blue-500
    hover:bg-gray-300 shadow-sm
    dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
    dark:focus:ring-blue-400 dark:hover:border-gray-500
  `,
  secondary: `
    bg-gray-300 text-gray-800 border-gray-400
    focus:ring-gray-400 focus:border-gray-400
    hover:bg-gray-400 shadow-sm
    dark:bg-gray-800 dark:text-gray-200 dark:border-gray-500
    dark:focus:ring-gray-500 dark:hover:border-gray-400
  `,
};


const SIZES = {
  sm: 'text-sm h-8 px-3',
  md: 'text-base h-10 px-4',
  lg: 'text-lg h-12 px-5',
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
}

const Input: React.FC<InputProps> = ({
    variant = 'primary',
    size = 'md',
    className,
    ...props
  }) => {
  return (
    <input
      className={clsx(
        BASE_CLASSES,
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
};

export default Input;
