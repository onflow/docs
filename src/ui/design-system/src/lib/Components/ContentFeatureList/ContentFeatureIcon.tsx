import React from 'react';
import WhyFlow from '../../../../images/page/feature-why-flow-icon.svg';
import WhyFlowImage from '../../../../images/misc/feature-why-flow-image.png';
import WandIcon from '../../../../images/page/feature-wand-icon.svg';
import WandImage from '../../../../images/misc/feature-wand-image.png';
import Stacks from '../../../../images/page/feature-stacks-icon.svg';
import StacksImage from '../../../../images/misc/feature-stacks-image.png';
import CodeScripts from '../../../../images/page/feature-code-scripts-icon.svg';
import CodeScriptsImage from '../../../../images/misc/feature-code-scripts-image.png';
import EvmCompat from '../../../../images/page/feature-evm-icon.svg';
import EvmCompatImage from '../../../../images/misc/feature-evm-image.png';

export interface ContentFeatureIconProps {
  icon: string;
}

export function ContentFeatureIcon({
  icon,
}: ContentFeatureIconProps): React.ReactElement {
  switch (icon) {
    case 'feature-why-flow-icon':
      return <WhyFlow />;
    case 'feature-why-flow-image':
      return <img src={WhyFlowImage} alt="Why Flow" />;
    case 'feature-wand-icon':
      return <WandIcon />;
    case 'feature-wand-image':
      return <img src={WandImage} alt="Smart Accounts" />;
    case 'feature-stacks-icon':
      return <Stacks />;
    case 'feature-stacks-image':
      return <img src={StacksImage} alt="Bundle & Scripted Transactions" />;
    case 'feature-code-scripts-icon':
      return <CodeScripts />;
    case 'feature-code-scripts-image':
      return <img src={CodeScriptsImage} alt="Scripted Queries" />;
    case 'feature-evm-icon':
      return <EvmCompat />;
    case 'feature-evm-image':
      return <img src={EvmCompatImage} alt="EVM Compatibility" />;
    default:
      throw new Error(`Icon type not recognized: ${icon}`);
  }
}
