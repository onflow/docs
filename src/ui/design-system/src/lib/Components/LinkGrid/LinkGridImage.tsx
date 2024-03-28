import React from 'react';
import DocIntroduction from '../../../../images/misc/docs-introduction.png';
import DocFundamentals from '../../../../images/misc/docs-fundamentals.png';
import DocStacks from '../../../../images/misc/docs-the-stack.png';
import DocAdvanced from '../../../../images/misc/docs-advanced.png';

export interface ContentFeatureIconProps {
  imageName: string;
}

export function LinkGridImage({
  imageName,
}: ContentFeatureIconProps): React.ReactElement {
  switch (imageName) {
    case 'docs-introduction':
      return <img width="80px" src={DocIntroduction} alt="Introduction" />;
    case 'docs-fundamentals':
      return <img width="80px" src={DocFundamentals} alt="Fundamentals" />;
    case 'docs-the-stack':
      return <img width="80px" src={DocStacks} alt="The Stack" />;
    case 'docs-advanced':
      return <img width="80px" src={DocAdvanced} alt="Advanced" />;
    default:
      throw new Error(`Icon type not recognized: ${imageName}`);
  }
}
