import React from 'react';

const CATEGORIES = [
  {
    title: 'Cadence',
    links: [
      { label: 'Why Flow', href: '/build/cadence/flow' },
      { label: 'Differences vs. EVM', href: '/build/cadence/differences-vs-evm' },
      { label: 'Getting Started', href: '/build/cadence/getting-started/contract-interaction' },
      { label: 'Flow Protocol', href: '/build/cadence/basics/blocks' },
      { label: 'App Architecture', href: '/build/cadence/app-architecture' },
      { label: 'Writing and Deploying Smart Contracts', href: '/build/cadence/smart-contracts/overview' },
      { label: 'Advanced Concepts', href: '/build/cadence/advanced-concepts/account-abstraction' },
      { label: 'Guides', href: '/build/cadence/advanced-concepts/account-abstraction' },
      { label: 'Core Smart Contracts', href: '/build/cadence/core-contracts' },
      { label: 'Explore More', href: '/build/cadence/explore-more' },
    ],
  },
  {
    title: 'EVM',
    links: [
      { label: 'Why EVM on Flow', href: '/build/evm/about' },
      { label: 'How it Works', href: '/evm/how-it-works' },
      { label: 'Using Flow EVM', href: '/evm/using' },
      { label: 'Network Information', href: '/evm/networks' },
      { label: 'EVM Quickstart', href: '/evm/quickstart' },
      { label: 'Fees', href: '/evm/fees' },
      { label: 'Accounts', href: '/evm/accounts' },
      { label: 'Cross-chain Bridges', href: '/ecosystem/bridges' },
      { label: 'Faucets', href: '/ecosystem/faucets' },
      { label: 'Block Explorers', href: '/ecosystem/block-explorers' },
      { label: 'Guides', href: '/evm/guides' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: '@onflow/react-sdk', href: '/tools/react-sdk' },
      { label: 'Flow Emulator', href: '/tools/emulator' },
      { label: 'Flow CLI', href: '/tools/flow-cli' },
      { label: 'Cadence VS Code Extension', href: '/tools/vscode-extension' },
      { label: 'Flow Dev Wallet', href: '/tools/flow-dev-wallet' },
      { label: 'Client Tools', href: '/tools/clients' },
      { label: 'Error Codes', href: '/tools/error-codes' },
      { label: 'Wallet Provider Spec', href: '/tools/wallet-provider-spec' },
      { label: 'Tools', href: '/tools' },
    ],
  },
  {
    title: 'Networks',
    links: [
      { label: 'Flow Networks', href: '/networks/flow-networks' },
      { label: 'Mainnet', href: '/networks/flow-networks/accessing-mainnet' },
      { label: 'Testnet', href: '/networks/flow-networks/accessing-testnet' },
      { label: 'Network Architecture', href: '/networks/network-architecture' },
      { label: 'Staking and Epochs', href: '/networks/staking' },
      { label: 'Node Ops', href: '/networks/node-ops' },
      { label: 'Accessing Data', href: '/networks/access-onchain-data' },
      { label: 'Governance', href: '/networks/governance' },
      { label: 'Flow Port', href: '/networks/flow-port' },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { label: 'Ecosystem', href: '/ecosystem' },
      { label: 'Wallets', href: '/ecosystem/wallets' },
      { label: 'Flow Block Explorers', href: '/ecosystem/block-explorers' },
      { label: 'Data Indexers', href: '/ecosystem/data-indexers' },
      { label: 'Developer Profile', href: '/ecosystem/developer-profile' },
      { label: 'DeFi & Liquidity', href: '/ecosystem/defi-liquidity' },
      { label: 'Bridges', href: '/ecosystem/bridges' },
      { label: 'Community Projects', href: '/ecosystem/projects' },
      { label: 'Builder Perks', href: '/ecosystem/builder-perks' },
      { label: 'VCs & Funds', href: '/ecosystem/vcs-and-funds' },
      { label: 'Faucets', href: '/ecosystem/faucets' },
      { label: 'Grants', href: '/ecosystem/grants' },
      { label: 'Hackathons and Events', href: '/ecosystem/Hackathons%20and%20Events' },
      { label: 'Auditors', href: '/ecosystem/auditors' },
      { label: 'Ecosystem Overview', href: '/ecosystem/overview' },
    ],
  },
  {
    title: 'Tutorials',
    links: [
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Use AI To Build On Flow', href: '/tutorials/use-AI-to-build-on-flow' },
      { label: 'Gasless Transactions', href: '/tutorials/gasless-transactions' },
      { label: 'Token Launch', href: '/tutorials/token-launch' },
      { label: 'Cross-VM Apps', href: '/tutorials/cross-vm-apps' },
      { label: 'FlowtoBooth', href: '/tutorials/flowtobooth' },
      { label: 'Native VRF', href: '/tutorials/native-vrf' },
    ],
  },
];

const BrowseByCategory: React.FC = () => {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.title} className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-primary-green-600 dark:text-primary-green-400 mb-4">{cat.title}</h3>
            <ul className="space-y-2">
              {cat.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-base text-gray-800 dark:text-gray-100 hover:text-primary-green-500 dark:hover:text-primary-green-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrowseByCategory; 