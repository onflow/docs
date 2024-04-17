import React from 'react';
import Discord from '../../../../images/misc/discord-image.png';
import XdotCom from '../../../../images/misc/x.com-image.png';
import Github from '../../../../images/misc/github-image.png';

export interface SocialCardIconProps {
  icon: string;
}

export function SocialCardIcon({
  icon,
}: SocialCardIconProps): React.ReactElement {
  switch (icon) {
    case 'discord':
      return <img src={Discord} alt="Discord" />;
    case 'x.com':
      return <img src={XdotCom} alt="X.com" />;
    case 'github':
      return <img src={Github} alt="GitHub" />;
    default:
      throw new Error(`Icon type not recognized: ${icon}`);
  }
}
