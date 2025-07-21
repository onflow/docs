import * as fcl from '@onflow/fcl';
import config from '@generated/docusaurus.config';
import flowJSON from '../../flow.json';
import type { FlowNetwork } from '@onflow/react-sdk';

const flowNetwork = (config.customFields?.flowNetwork as string) || 'testnet';

console.log('Dapp running on network:', flowNetwork);

export function configureFCL(): void {
  fcl.config({
    'flow.network': flowKitConfig.flowNetwork,
    'accessNode.api': flowKitConfig.accessNodeUrl,
    'discovery.wallet': `https://fcl-discovery.onflow.org/${flowKitConfig.flowNetwork}/authn`,
    'app.detail.icon': flowKitConfig.appDetailIcon,
    'app.detail.title': flowKitConfig.appDetailTitle,
    'app.detail.description': flowKitConfig.appDetailDescription,
    'walletconnect.projectId': config.customFields?.walletConnectProjectId as string | undefined,
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

const storage = {
  can: fcl.LOCAL_STORAGE.can,
  get: (key: string) => fcl.LOCAL_STORAGE.get(`isolated-CURRENT-USER`),
  set: (key: string, value: string) => fcl.LOCAL_STORAGE.put(`isolated-CURRENT-USER`, value),
  removeItem: (key: string) => fcl.LOCAL_STORAGE.removeItem(`isolated-CURRENT-USER`),
}

export const flowKitConfig = {
  accessNodeUrl:
    flowNetwork === 'mainnet'
      ? 'https://rest-mainnet.onflow.org'
      : 'https://rest-testnet.onflow.org',
  flowNetwork: flowNetwork as FlowNetwork,
  appDetailTitle: 'Flow Dev Portal',
  appDetailIcon: 'https://avatars.githubusercontent.com/u/62387156?v=4',
  appDetailDescription: 'The developer portal for Flow Blockchain',
  discoveryWallet: `https://fcl-discovery.onflow.org/${flowNetwork}/authn`,
  storage,
};

configureFCL();
