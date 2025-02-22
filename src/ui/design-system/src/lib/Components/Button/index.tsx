import React from 'react';
import clsx from 'clsx';
import ChevronRightIcon from '../../../../images/arrows/chevron-right-sm.svg';
import ExternalLinkIcon from '../../../../images/content/external-link-variant.svg';

const BASE_CLASSES =
  'inline-flex items-center justify-center font-semibold text-center border transition duration-200 cursor-pointer font-display';

const VARIANTS = {
  black: {
    base: 'bg-black text-white border-transparent',
    hover: 'hover:bg-gray-800 hover:text-white',
    active: 'active:bg-gray-900 active:text-white',
    dark: {
      base: 'dark:bg-white dark:text-black',
      hover: 'dark:hover:bg-gray-100 dark:hover:text-black',
      active: 'dark:active:bg-gray-200 dark:active:text-black',
    },
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  primary: {
    base: 'bg-blue-600 text-white border-transparent',
    hover: 'hover:bg-blue-700 hover:text-white',
    active: 'active:bg-blue-800 active:text-white',
    dark: {
      base: 'dark:bg-blue-500 dark:text-gray-100',
      hover: 'dark:hover:bg-blue-600 dark:hover:text-white',
      active: 'dark:active:bg-blue-700 dark:active:text-white',
    },
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  'primary-no-darkmode': {
    base: 'bg-black text-white border-transparent',
    hover: 'hover:border-black hover:bg-white hover:text-black',
    active: 'active:border-gray-500 active:bg-white active:text-gray-500',
    disabled:
      'disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed',
  },
  secondary: {
    base: 'text-primary-blue border-primary-blue',
    hover: 'hover:bg-primary-blue hover:text-white cursor-pointer',
    active: 'active:bg-blue-hover active:text-white',
    dark: {
      base: 'dark:bg-black dark:text-blue-dark dark:border-blue-dark',
      hover: 'dark:hover:bg-blue-dark dark:hover:text-white',
      active:
        'dark:active:bg-blue-hover-dark dark:active:text-white dark:active:border-blue-hover-dark',
    },
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  accent: {
    base: 'bg-green-dark text-white border-accent-blue',
    hover: 'hover:bg-green-dark hover:text-white cursor-pointer',
    active: 'active:bg-green-hover active:text-white',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  ghost: {
    base: 'bg-transparent text-black border-transparent',
    hover: 'hover:bg-gray-200 hover:text-black',
    active: 'active:bg-gray-300 active:text-black',
    dark: {
      base: 'dark:bg-transparent dark:text-white',
      hover: 'dark:hover:bg-gray-800 dark:hover:text-white',
      active: 'dark:active:bg-gray-900 dark:active:text-white',
    },
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
};

const SIZES = {
  sm: ['text-sm px-4 py-2 rounded-md gap-2'],
  md: ['text-sm px-6 py-3 rounded-lg gap-3'],
};

type ButtonProps = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  disabled?: boolean;
  href?: string; // Determines if it renders as a link
  leftIcon?: 'left';
  rightIcon?: 'right' | 'external';
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'button'> &
  React.ComponentPropsWithoutRef<'a'>;

export function Button({
  href,
  className,
  size = 'md',
  variant = 'black',
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps): JSX.Element {
  const variantStyles = VARIANTS[variant];

  const combinedStyles = clsx(
    BASE_CLASSES,
    SIZES[size],
    variantStyles.base,
    variantStyles.hover,
    variantStyles.active,
    disabled && variantStyles.disabled,
    variantStyles.dark?.base,
    variantStyles.dark?.hover,
    variantStyles.dark?.active,
    className,
  );

  const ButtonContent = (
    <>
      {leftIcon === 'left' && (
        <div className="relative -top-[1px] rotate-180">
          <ChevronRightIcon />
        </div>
      )}
      {children}
      {rightIcon === 'right' && <ChevronRightIcon />}
      {rightIcon === 'external' && <ExternalLinkIcon />}
    </>
  );

  if (href) {
    // Render as a link
    return (
      <a
        href={disabled ? undefined : href}
        className={clsx(combinedStyles, { 'pointer-events-none': disabled })}
        {...props}
      >
        {ButtonContent}
      </a>
    );
  }

  // Render as a button
  return (
    <button className={combinedStyles} disabled={disabled} {...props}>
      {ButtonContent}
    </button>
  );
}
