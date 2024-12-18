import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import clsx from 'clsx';

const BASE_CLASSES =
  'inline-flex items-center justify-center font-semibold text-center border transition duration-200 cursor-pointer';

const VARIANTS = {
  black: `
    bg-black text-white border-transparent hover:bg-gray-800 active:bg-gray-900
    dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:active:bg-gray-300
  `,
  menu: `
    bg-black text-white border border-gray-700 shadow-lg hover:bg-gray-800
    dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-200
  `,
};

export interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  buttonLabel: string;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ buttonLabel, items }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* Button */}
      <MenuButton
        className={clsx(BASE_CLASSES, VARIANTS.black, 'px-4 py-2 rounded-md text-sm')}
      >
        {buttonLabel}
      </MenuButton>

      {/* Dropdown Menu */}
      <MenuItems
        anchor="bottom end"
        className="absolute right-0 mt-1 w-52 rounded-md shadow-lg focus:outline-none z-[999]"
      >
        {items.map((item, index) => (
          <MenuItem key={`${index}${item.label}`}>
            {({ active }) => (
              <button
                onClick={item.onClick}
                className={clsx(
                  VARIANTS.menu,
                  'w-full px-4 py-2 cursor-pointer',
                  active &&
                  'hover:bg-gray-800 dark:hover:bg-gray-200',
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
