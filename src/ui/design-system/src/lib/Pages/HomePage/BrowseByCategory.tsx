import React from 'react';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES } from '@site/src/constants/ga-events';

const CATEGORIES = [
  {
    title: 'Defi',
    links: [
      { label: 'DeFi', href: '/defi' },
      { label: 'DeFi Contracts Mainnet', href: '/defi/defi-contracts-mainnet' },
      { label: 'DeFi Contracts Testnet', href: '/defi/defi-contracts-testnet' },
      { label: 'Cross-chain Swaps', href: '/defi/cross-chain-swaps' },
      { label: 'Add Token to MetaMask', href: '/defi/add-token-to-metamask' },
      { label: 'Band Oracle', href: '/defi/band-oracle' },
      { label: 'FAQ', href: '/defi/faq' },
    ],
  },
  {
    title: 'Tutorials',
    links: [
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Use AI To Build On Flow', href: '/blockchain-development-tutorials/use-AI-to-build-on-flow' },
      { label: 'Gasless Transactions', href: '/blockchain-development-tutorials/gasless-transactions' },
      { label: 'Token Launch', href: '/blockchain-development-tutorials/token-launch' },
      { label: 'Cross-VM Apps', href: '/blockchain-development-tutorials/cross-vm-apps' },
      { label: 'FlowtoBooth', href: '/blockchain-development-tutorials/flowtobooth' },
      { label: 'Native VRF', href: '/blockchain-development-tutorials/native-vrf' },
    ],
  },
  {
    title: 'Cadence',
    links: [
      { label: 'Why Flow', href: '/build/flow' },
      { label: 'Differences vs. EVM', href: '/build/cadence/differences-vs-evm' },
      { label: 'Getting Started', href: '/blockchain-development-tutorials/cadence/getting-started/smart-contract-interaction' },
      { label: 'Basics', href: '/build/cadence/basics/blocks' },
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
      { label: 'EVM Quickstart', href: '/evm/quickstart' },
      { label: 'How it Works', href: '/evm/how-it-works' },
      { label: 'Using Flow EVM', href: '/evm/using' },
      { label: 'Network Information', href: '/evm/networks' },
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
      { label: 'Flow Networks', href: '/protocol/flow-networks' },
      { label: 'Mainnet', href: '/protocol/flow-networks/accessing-mainnet' },
      { label: 'Testnet', href: '/protocol/flow-networks/accessing-testnet' },
      { label: 'Network Architecture', href: '/protocol/network-architecture' },
      { label: 'Staking and Epochs', href: '/protocol/staking' },
      { label: 'Node Ops', href: '/protocol/node-ops' },
      { label: 'Accessing Data', href: '/protocol/access-onchain-data' },
      { label: 'Governance', href: '/protocol/governance' },
      { label: 'Flow Port', href: '/protocol/flow-port' },
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
      { label: 'Bridges', href: '/ecosystem/bridges' },
      { label: 'Community Projects', href: '/ecosystem/projects' },
      { label: 'Builder Perks', href: '/ecosystem/builder-perks' },
      { label: 'VCs & Funds', href: '/ecosystem/vcs-and-funds' },
      { label: 'Faucets', href: '/ecosystem/faucets' },
      { label: 'Grants', href: '/ecosystem/grants' },
      { label: 'Hackathons and Events', href: '/ecosystem/hackathons-and-events' },
      { label: 'Auditors', href: '/ecosystem/auditors' },
    ],
  },
];

const BrowseByCategory: React.FC = () => {
  const handleLinkClick = (label: string, href: string, category: string) => {
    event({
      action: GA_EVENTS.ACTION_CARD_CLICK,
      category: GA_CATEGORIES.ACTION_CARD,
      label: `${category} - ${label}`,
      location: true,
      href: href,
    });
  };

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Browse by category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => {
          const firstLink = cat.links[0];
          const remainingLinks = cat.links.slice(1);
          
          return (
            <div key={cat.title} className="flex flex-col">
              <a
                href={firstLink.href}
                target={firstLink.href.startsWith('http') ? '_blank' : undefined}
                rel={firstLink.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={() => handleLinkClick(firstLink.label, firstLink.href, cat.title)}
                className="text-base font-semibold text-gray-900 dark:text-white mb-4 hover:text-[#00EF8B] transition-colors no-underline"
              >
                {cat.title}
              </a>
              <ul className="space-y-2.5">
                {remainingLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      onClick={() => handleLinkClick(link.label, link.href, cat.title)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BrowseByCategory; 