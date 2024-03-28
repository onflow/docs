import React from 'react';
import AppLink from '../AppLink';
import { HomepageStartItemIcons } from './HomepageStartIcons';

export interface HomepagePillItemsProps {
  link: string;
  icon: string;
  text: string;
  subText?: string;
}

export function HomepagePillItem({
  link,
  text,
  icon,
  subText = 'View Latest',
}: HomepagePillItemsProps): React.ReactElement {
  return (
    <AppLink
      className="flex w-full h-full px-3 py-2 cursor-pointer gap-4 rounded-custom text-black hover:no-underline hover:text-black hover:bg-primary-gray-10 bg-white justify-start items-center hover:border-black"
      to={link}
    >
      <HomepageStartItemIcons icon={icon} />
      <div className="relative group h-full">
        <div className="flex h-full text-semibold group-hover:translate-y-[-10px] transition-transform duration-200 ease-in-out">
          <span className="text-center">{text}</span>
        </div>
        {/* Subtext (hidden by default and shown on hover) */}
        <div className="absolute bottom-[-3px] left-0 right-0 opacity-0 group-hover:opacity-80 transition-opacity duration-200 ease-in-out">
          <span className="text-xs block">View latest notes →</span>
        </div>
      </div>
    </AppLink>
  );
}
