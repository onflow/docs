import React from 'react';
import Logo from '../../../../images/logos/flow-docs-logo.svg';

const NAV_LINKS = [
  { label: 'Cadence', href: '/cadence' },
  { label: 'EVM', href: '/evm' },
  { label: 'Tools', href: '/tools' },
  { label: 'Networks', href: '/networks' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Growth', href: '/growth' },
  { label: 'Tutorials', href: '/tutorials' },
  // { label: 'Sign In', href: '/signin' },
  { label: 'Github', href: 'https://github.com/onflow', external: true },
  { label: 'Discord', href: 'https://discord.gg/flow', external: true },
];

const HeaderNav: React.FC = () => {
  return (
    <header className="w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-50 sticky top-0">
      <a href="/" className="flex items-center gap-2">
        <Logo className="h-8 w-auto" />
        <span className="sr-only">Home</span>
      </a>
      <nav className="flex-1 flex justify-center gap-6">
        {NAV_LINKS.slice(0, 7).map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-base font-medium text-gray-900 dark:text-white hover:text-primary-green-500 transition-colors"
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex gap-4">
        {NAV_LINKS.slice(7).map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-base font-medium text-gray-900 dark:text-white hover:text-primary-green-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
};

export default HeaderNav; 