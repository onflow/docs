import React from 'react';
import clsx from 'clsx';
import ChevronRightIcon from '../../../../images/arrows/chevron-right-sm.svg';
import ExternalLinkIcon from '../../../../images/content/external-link-variant.svg';

const BASE_CLASSES =
  'inline-flex items-center justify-center font-semibold text-center border transition duration-200 cursor-pointer';

const VARIANTS = {
  primary: [
    'bg-blue-600 text-white border-transparent',
    'hover:bg-blue-700 hover:text-white',
    'active:bg-blue-800 active:text-white',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  secondary: [
    'bg-white text-blue-600 border-blue-600',
    'hover:bg-blue-50 hover:border-blue-700',
    'active:bg-blue-100 active:border-blue-800',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  accent: [
    'bg-green-600 text-white border-transparent',
    'hover:bg-green-700 hover:text-white',
    'active:bg-green-800 active:text-white',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  black: [
    'bg-black text-white border-transparent',
    'hover:bg-gray-800 hover:text-white',
    'active:bg-gray-900 active:text-white',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
};


const SIZES = {
  sm: ['text-sm px-4 py-2 rounded-md'],
  md: ['text-base px-6 py-3 rounded-lg'],
  lg: ['text-lg px-8 py-4 rounded-lg'],
};

type ButtonContentProps = {
  children: React.ReactNode;
  leftIcon?: 'left';
  rightIcon?: 'right' | 'external';
};

type ButtonBaseProps = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
} & ButtonContentProps;

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  ButtonBaseProps;

function ButtonContent({
    leftIcon,
    rightIcon,
    children,
  }: ButtonContentProps): JSX.Element {
  return (
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
}

export function Button({
     className,
     size = 'md',
     variant = 'black',
     leftIcon,
     rightIcon,
     children,
     disabled,
     ...props
  }: ButtonProps & { disabled?: boolean }): JSX.Element {
  return (
    <button
      className={clsx(
        BASE_CLASSES,
        SIZES[size],
        VARIANTS[variant],
        { 'cursor-not-allowed opacity-50': disabled },
        className
      )}
      disabled={disabled}
      {...props}
    >
      <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
        {children}
      </ButtonContent>
    </button>
  );
}

export type ButtonLinkProps = React.ComponentPropsWithoutRef<'a'> &
  ButtonBaseProps & {
  href: string;
  children: React.ReactNode;
};

export function ButtonLink({
    className,
    size = 'md',
    variant = 'primary',
    href,
    leftIcon,
    rightIcon,
    children,
    ...props
  }: ButtonLinkProps): JSX.Element {
  return (
    <a
      href={href}
      className={clsx(BASE_CLASSES, SIZES[size], VARIANTS[variant], className)}
      {...props}
    >
      <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>
        {children}
      </ButtonContent>
    </a>
  );
}
