import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import clsx from 'clsx';

const BASE_CLASSES =
  'inline-flex items-center justify-center font-semibold text-center border transition duration-200 cursor-pointer';

const VARIANTS = {
  black: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900',
  white: 'bg-white text-black border border-gray-300 hover:bg-gray-100 active:bg-gray-200',
};

const MENU_CLASSES =
  'text-white bg-gray-900 border border-gray-600 shadow-lg dark:shadow-gray-800 hover:bg-gray-700 transition duration-200';

export interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  buttonLabel: string;
  items: DropdownItem[];
  buttonVariant?: 'black' | 'white';
}

const Dropdown: React.FC<DropdownProps> = ({ buttonLabel, items, buttonVariant = 'black' }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* Button */}
      <MenuButton
        className={clsx(BASE_CLASSES, VARIANTS[buttonVariant], 'px-4 py-2 rounded-md text-sm')}
      >
        {buttonLabel}
      </MenuButton>

      {/* Dropdown Menu */}
      <MenuItems
        anchor="bottom end"
        className="absolute right-0 mt-1 w-52 rounded-md shadow-lg focus:outline-none z-[999]"
        style={{ position: 'absolute', zIndex: 999, top: '100%' }}
      >
        {items.map((item, index) => (
          <MenuItem key={`${index}${item.label}`}>
            {({ active }) => (
              <button
                onClick={item.onClick}
                className={clsx(
                  MENU_CLASSES,
                  'w-full px-4 py-2 cursor-pointer',
                  active && 'bg-gray-800',
                  index === 0 && 'rounded-t-md',
                  index === items.length - 1 && 'rounded-b-md'
                )}
              >
                {item.label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default Dropdown;
