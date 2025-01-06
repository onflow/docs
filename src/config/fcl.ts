import * as fcl from '@onflow/fcl';
import config from '@generated/docusaurus.config';
import flowJSON from '../../flow.json';

const flowNetwork = config.customFields?.flowNetwork;

console.log('Dapp running on network:', flowNetwork);

export function configureFCL(): void {
  fcl.config({
    'flow.network': flowNetwork,
    'accessNode.api':
      flowNetwork === 'mainnet'
        ? 'https://rest-mainnet.onflow.org'
        : 'https://rest-testnet.onflow.org',
    'discovery.wallet': `https://fcl-discovery.onflow.org/${flowNetwork}/authn`,
    'app.detail.icon': 'https://avatars.githubusercontent.com/u/62387156?v=4',
    'app.detail.title': 'Flow Dev Portal',
    'app.detail.description': 'The developer portal for Flow Blockchain',
    'walletconnect.projectId': process.env.WALLETCONNECT_PROJECT_ID,
  });

  fcl.config.load({
    flowJSON,
  });
}

configureFCL();
