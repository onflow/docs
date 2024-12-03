import * as fcl from '@onflow/fcl';
import config from '@generated/docusaurus.config';

console.log('Dapp running on network:', config.customFields.flowNetwork);

export function configureFCL(): void {
  fcl.config({
    'flow.network': config.customFields.flowNetwork,
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': `https://fcl-discovery.onflow.org/${'testnet'}/authn`,
  });
}

configureFCL();