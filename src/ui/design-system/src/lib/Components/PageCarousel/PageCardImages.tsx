import React from 'react';
import CreateFungibleTokens from '../../../../images/misc/create-fungible-tokens.png';
import LaunchAnNFT from '../../../../images/misc/launch-an-nft.png';
import QuickstartImpl from '../../../../images/misc/quickstart-impl.png';
import EmeraldSnippets from '../../../../images/misc/emerald-snippets.png';
import EmeraldExamples from '../../../../images/misc/emerald-examples.png';
import CadenceCookbook from '../../../../images/misc/cadence-cookbook.png';
import EcosystemTools from '../../../../images/misc/ecosystem-tools.png';
import CadenceVscode from '../../../../images/misc/cadence-vscode.png';
import CadencePlayground from '../../../../images/misc/cadence-playground.png';

export interface ContentFeatureIconProps {
  imageName: string;
}

export function PageCardImage({
  imageName,
}: ContentFeatureIconProps): React.ReactElement {
  switch (imageName) {
    case 'ecosystem-tools':
      return <img src={EcosystemTools} alt="Ecosystem & Tools" />;
    case 'cadence-vscode':
      return <img src={CadenceVscode} alt="Cadence" />;
    case 'cadence-playground':
      return <img src={CadencePlayground} alt="Cadence Playground" />;
    case 'emerald-snippets':
      return <img src={EmeraldSnippets} alt="Emerald Snippets" />;
    case 'emerald-examples':
      return <img src={EmeraldExamples} alt="Emerald Examples" />;
    case 'cadence-cookbook':
      return <img src={CadenceCookbook} alt="Cadence Cookbook" />;
    case 'create-fungible-tokens':
      return <img src={CreateFungibleTokens} alt="Create Fungible Tokens" />;
    case 'launch-an-nft':
      return <img src={LaunchAnNFT} alt="Launch an NFT" />;
    case 'quickstart-impl':
      return <img src={QuickstartImpl} alt="Quick Starts" />;
    default:
      throw new Error(`Icon type not recognized: ${imageName}`);
  }
}
