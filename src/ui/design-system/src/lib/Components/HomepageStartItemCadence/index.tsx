import React from 'react';
import AppLink from '../AppLink';
import {
  HomepageStartItemIcons,
  type HomepageStartItemIconsProps,
} from './HomepageStartIcons';

export type HomepageStartItemProps = {
  link: string;
  icon: string;
} & HomepageStartItemIconsProps;

export function HomepageStartItemCadence({
  link,
  icon,
}: HomepageStartItemProps): React.ReactElement {
  return (
    <AppLink
      style={{ cursor: 'pointer' }}
      className="flex w-full h-full cursor-pointer gap-6 rounded-lg text-white hover:text-white justify-center items-center hover:border-black transition-opacity duration-200 ease-out hover:opacity-90"
      to={link}
    >
      <HomepageStartItemIcons icon={icon} />
    </AppLink>
  );
}
