import React from 'react';
import { SocialCardIcon } from './SocialCardIcon';
import AppLink from '../AppLink';
export interface SocialCardItemProps {
  icon: string;
  title: string;
  subText: string;
  url: string;
}

export const SocialCardItem = ({
  icon,
  title,
  subText,
  url,
}: SocialCardItemProps): React.ReactElement => {
  return (
    <AppLink
      className="cursor-pointer text-gray-100 hover:no-underline hover:text-gray-100"
      to={url}
    >
      <div className="flex flex-col gap-4 min-w-[320px] h-[278px] rounded-lg bg-gray-800 justify-center items-center border border-transparent hover:border-solid hover:border-primary-green transition duration-500 ease-in-out">
        <SocialCardIcon icon={icon} />
        <div className="font-semibold">{title}</div>
        <div className="font-semibold text-primary-green">{subText}</div>
      </div>
    </AppLink>
  );
};
