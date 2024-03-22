import React from 'react';
import { ContentFeatureIcon } from './ContentFeatureIcon';

export interface ContentFeatureProps {
  icon: string;
  image: string;
  header: string;
  text: string;
  headerLink?: string;
}

export function ContentFeature({
  icon,
  image,
  header,
  text,
  headerLink,
}: ContentFeatureProps): React.ReactElement {
  return (
    <div className="container flex flex-col justify-between rounded-md bg-card-gradient h-[256px]">
      <div>
        <div className="text-xl text-white font-semibold px-4 pt-4">
          {header}
        </div>
        <div className="text-sm text-white px-4">{text}</div>
      </div>
      <div className={`flex justify-between items-center flex-row gap-4`}>
        <ContentFeatureIcon icon={icon} />
        <ContentFeatureIcon icon={image} />
      </div>
    </div>
  );
}
