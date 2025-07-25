import * as fcl from '@onflow/fcl';
import config from '@generated/docusaurus.config';
import flowJSON from '../../flow.json';

const flowNetwork = (config.customFields?.flowNetwork as string) || 'testnet';

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
    'walletconnect.projectId': config.customFields?.walletConnectProjectId as
      | string
      | undefined,
  });

  fcl.config.load({
    flowJSON,
  });
}

/**
 * Get the contract address for a given contract name from the flow.json file
 * @param contractName
 * @returns Contract address
 */
export function getContractAddress(contractName: string): string {
  const deploymentAccount = Object.entries(
    flowJSON.deployments[flowNetwork],
  ).find(([_, c]) => (c as string[]).includes(contractName))?.[0];

  if (deploymentAccount) {
    return flowJSON.accounts[deploymentAccount].address;
  }

  const externalAddress =
    flowJSON.contracts[contractName]?.aliases[flowNetwork];
  if (externalAddress) {
    return externalAddress;
  }

  throw new Error(`Contract address not found for ${contractName}`);
}

configureFCL();
