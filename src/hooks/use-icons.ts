import { useMemo } from 'react';

// Static icon paths - more reliable than dynamic imports
const getIconPath = (name: string): string | null => {
  switch (name) {
    // BuildGridData icons
    case 'getting-started':
      return '/images/icons/getting-started.svg';
    case 'why-flow':
      return '/images/icons/why-flow.svg';
    case 'hello-world':
      return '/images/icons/hello-world.svg';
    case 'flow-cadence':
      return '/images/icons/flow-cadence.svg';
    case 'evm-on-flow':
      return '/images/icons/evm-on-flow.svg';
    case 'random':
      return '/images/icons/random.svg';
    case 'batched-evm-transactions':
      return '/images/icons/batched-evm-transactions.svg';
    case 'flow-client-library':
      return '/images/icons/flow-client-library.svg';
    case 'tools':
      return '/images/icons/flow-tools.svg';
    case 'faucet':
      return '/images/icons/Faucet.svg';
    
    // GrowGridData icons
    case 'grow':
      return '/images/icons/flow-grow.svg';
    case 'builder-credits':
      return '/images/icons/builder-credits.svg';
    case 'dev-office-hours':
      return '/images/icons/dev-office-hours.svg';
    case 'grants':
      return '/images/icons/flow-grants.svg';
    case 'startup-support':
      return '/images/icons/startup-support.svg';
    case 'vcs-&-funds':
      return '/images/icons/vcs-&-funds.svg';
    
    // Other commonly used icons
    case 'learn':
      return '/images/icons/flow-learn.svg';
    case 'gs-hello-world':
      return '/images/icons/gs-hello-world.svg';
    case 'cadence':
      return '/images/icons/cadence-logo-mark-black-1.svg';
    case 'solidity':
      return '/images/icons/flow-evm.svg';
    
    default:
      return null;
  }
};

// Cache for loaded icons
const iconCache = new Map<string, any>();

export function useIcons() {
  return useMemo(() => {
    const loadIcon = (name: string) => {
      // Check cache first
      if (iconCache.has(name)) {
        return iconCache.get(name);
      }

      // Check if it's a static path
      if (name === 'quicknode' || name === 'olympix-logo' || name === 'flow' || name === 'alchemy' || name === 'thirdweb' || name === 'uniblock') {
        return `/img/ecosystem/${name}.svg`;
      }

      // Get static icon path
      const iconPath = getIconPath(name);
      if (iconPath) {
        iconCache.set(name, iconPath);
        return iconPath;
      }

      return null;
    };

    // Preload commonly used icons
    const preloadCommonIcons = () => {
      const commonIcons = ['getting-started', 'grow', 'tools', 'learn'];
      commonIcons.forEach(iconName => {
        if (!iconCache.has(iconName)) {
          getIconPath(iconName);
        }
      });
    };

    // Start preloading common icons
    preloadCommonIcons();

    return {
      loadIcon,
      // Return cached icons for immediate access
      getIcon: (name: string) => iconCache.get(name) || null,
      // Preload specific icons
      preloadIcon: (name: string) => {
        if (!iconCache.has(name)) {
          getIconPath(name);
        }
      },
    };
  }, []);
}
