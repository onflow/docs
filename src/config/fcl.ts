import * as fcl from '@onflow/fcl';

const flowNetwork = 'testnet';

console.log('Dapp running on network:', flowNetwork);

export function configureFCL(): void {
  fcl.config({
    'flow.network': flowNetwork,
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': `https://fcl-discovery.onflow.org/${flowNetwork}/authn`,
  });
}

configureFCL();