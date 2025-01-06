import React from 'react';
import clsx from 'clsx';

const BASE_CLASSES =
  'block w-full rounded-md border px-4 py-2 text-sm focus:outline-none transition';

const VARIANTS = {
  black: `
    bg-black text-white border-gray-700 placeholder-gray-400 focus:ring-gray-800 focus:border-gray-800
    dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-gray-500
  `,
  primary: `
    bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500
    dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-300
  `,
  secondary: `
    bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-500 focus:ring-gray-400 focus:border-gray-400
    dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:ring-gray-600
  `,
};

const SIZES = {
  sm: 'text-sm h-8',
  md: 'text-base h-10',
  lg: 'text-lg h-12',
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