import React from 'react';
import AppLink from '../AppLink';
import { HomepageStartItemIcons } from './HomepageStartIcons';
import IconArrow from '../../../../images/page/icon-arrow.svg';

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
  subText,
}: HomepagePillItemsProps): React.ReactElement {
  return (
    <AppLink
      className="flex w-full h-full px-3 py-2 cursor-pointer gap-4 rounded-custom text-black hover:no-underline hover:text-black bg-white justify-start items-center hover:border-black"
      to={link}
    >
      <HomepageStartItemIcons icon={icon} />
      <div className="flex flex-col">
        {text}
        {subText !== '' && (
          <div className="flex items-center">
            <span className="text-xs text-primary-gray-400">{subText}</span>
            <IconArrow />
          </div>
        )}
      </div>
    </AppLink>
  );
}
