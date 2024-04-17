import React from 'react';
import { ContentFeatureIcon } from './ContentFeatureIcon';
import AppLink from '../AppLink';

export interface ContentFeatureProps {
  icon: string;
  image: string;
  header: string;
  text: string;
  link: string;
}

export function ContentFeature({
  icon,
  image,
  header,
  text,
  link,
}: ContentFeatureProps): React.ReactElement {
  return (
    <AppLink
      className="container px-0 flex flex-col justify-between rounded-md bg-light-card dark:bg-card-gradient h-[256px] 
      hover:opacity-80 hover:no-underline transition-opacity duration-300 ease-in-out group"
      to={link}
    >
      <div>
        <div className="text-xl text-white font-semibold pl-8 pt-4">
          {header}
        </div>
        <div className="text-sm text-white px-8">{text}</div>
      </div>
      <div className={`flex justify-between items-center flex-row pl-8`}>
        <ContentFeatureIcon icon={icon} />
        <ContentFeatureIcon icon={image} />
      </div>
    </AppLink>
  );
}
