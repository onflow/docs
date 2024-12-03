import * as fcl from '@onflow/fcl';
import config from '@generated/docusaurus.config';

const flowNetwork = config.customFields.flowNetwork;

console.log('Dapp running on network:', flowNetwork);

export function configureFCL(): void {
  fcl.config({
    'flow.network': flowNetwork,
    'accessNode.api': flowNetwork ?
      'https://rest-testnet.onflow.org' :
      'https://rest-mainnet.onflow.org',
    'discovery.wallet': `https://fcl-discovery.onflow.org/${flowNetwork}/authn`,
  });
}

configureFCL();