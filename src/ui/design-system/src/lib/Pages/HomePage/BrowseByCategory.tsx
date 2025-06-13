import React from 'react';

const CATEGORIES = [
  {
    title: 'Documentation',
    links: [
      { label: 'Getting Started', href: '/build/getting-started' },
      { label: 'SDKs & Tools', href: '/tools' },
      { label: 'Cadence', href: '/cadence' },
      { label: 'Mobile', href: '/build/guides/mobile' },
      { label: 'FCL', href: '/tools/fcl' },
      { label: 'Testing', href: '/build/testing' },
      { label: 'CLI', href: '/tools/flow-cli' },
      { label: 'Emulator', href: '/tools/emulator' },
      { label: 'Dev Wallet', href: '/tools/dev-wallet' },
      { label: 'VS Code Extension', href: '/tools/vscode-extension' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Ecosystem', href: '/ecosystem' },
      { label: 'Flow Port', href: 'https://port.onflow.org', external: true },
      { label: 'Developer Grants', href: '/ecosystem/grants' },
      { label: 'Flowverse', href: 'https://www.flowverse.co/', external: true },
      { label: 'Emerald Academy', href: 'https://academy.ecdao.org/', external: true },
      { label: 'FLOATs', href: 'https://floats.city/', external: true },
    ],
  },
  {
    title: 'Start Building',
    links: [
      { label: 'Flow Playground', href: 'https://play.onflow.org/', external: true },
      { label: 'Cadence Tutorials', href: '/cadence/tutorials' },
      { label: 'Cadence Cookbook', href: 'https://www.cadencecookbook.com/', external: true },
      { label: 'Core Contracts & Standards', href: '/cadence/core-contracts' },
      { label: 'EVM', href: '/evm' },
    ],
  },
  {
    title: 'Network',
    links: [
      { label: 'Network Status', href: 'https://status.onflow.org/', external: true },
      { label: 'Flowscan Mainnet', href: 'https://flowscan.org/', external: true },
      { label: 'Flowscan Testnet', href: 'https://testnet.flowscan.org/', external: true },
      { label: 'Node Operation', href: '/network/node-operation' },
      { label: 'Spork Information', href: '/network/sporks' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'GitHub', href: 'https://github.com/onflow', external: true },
      { label: 'Discord', href: 'https://discord.gg/flow', external: true },
      { label: 'Forum', href: 'https://forum.flow.com/', external: true },
      { label: 'Blog', href: 'https://medium.com/dapperlabs-blog', external: true },
    ],
  },
];

const BrowseByCategory: React.FC = () => {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.title} className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col">
            <h3 className="text-xl font-semibold text-primary-green-600 dark:text-primary-green-400 mb-4">{cat.title}</h3>
            <ul className="space-y-2">
              {cat.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
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