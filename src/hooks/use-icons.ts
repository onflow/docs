import { useMemo } from 'react';

// True dynamic loading using webpack dynamic imports
// This creates separate chunks for each SVG, loaded only when needed
const iconImports: Record<string, () => Promise<any>> = {
  // BuildGridData icons
  'getting-started': () => import('@site/static/images/icons/getting-started.svg'),
  'why-flow': () => import('@site/static/images/icons/why-flow.svg'),
  'hello-world': () => import('@site/static/images/icons/hello-world.svg'),
  'flow-cadence': () => import('@site/static/images/icons/flow-cadence.svg'),
  'evm-on-flow': () => import('@site/static/images/icons/evm-on-flow.svg'),
  'random': () => import('@site/static/images/icons/random.svg'),
  'batched-evm-transactions': () => import('@site/static/images/icons/batched-evm-transactions.svg'),
  'flow-client-library': () => import('@site/static/images/icons/flow-client-library.svg'),
  'tools': () => import('@site/static/images/icons/flow-tools.svg'),
  'faucet': () => import('@site/static/images/icons/Faucet.svg'),
  
  // GrowGridData icons
  'grow': () => import('@site/static/images/icons/flow-grow.svg'),
  'builder-credits': () => import('@site/static/images/icons/builder-credits.svg'),
  'dev-office-hours': () => import('@site/static/images/icons/dev-office-hours.svg'),
  'grants': () => import('@site/static/images/icons/flow-grants.svg'),
  'startup-support': () => import('@site/static/images/icons/startup-support.svg'),
  'vcs-&-funds': () => import('@site/static/images/icons/vcs-&-funds.svg'),
  
  // Other commonly used icons
  'learn': () => import('@site/static/images/icons/flow-learn.svg'),
  'gs-hello-world': () => import('@site/static/images/icons/gs-hello-world.svg'),
  'cadence': () => import('@site/static/images/icons/cadence-logo-mark-black-1.svg'),
  'solidity': () => import('@site/static/images/icons/flow-evm.svg'),
};

// Dynamic icon loader that creates separate chunks
const loadIconFromContext = async (name: string): Promise<string | null> => {
  const importFn = iconImports[name];
  if (!importFn) return null;
  
  try {
    // This creates a separate chunk for each SVG
    const icon = await importFn();
    return icon.default || icon;
  } catch (error) {
    console.warn(`Failed to load icon: ${name}`, error);
    return null;
  }
};

// Cache for loaded icons
const iconCache = new Map<string, any>();

export function useIcons() {
  return useMemo(() => {
    const loadIcon = async (name: string) => {
      // Check cache first
      if (iconCache.has(name)) {
        return iconCache.get(name);
      }

      // Check if it's a static path
      if (name === 'quicknode' || name === 'olympix-logo' || name === 'flow' || name === 'alchemy' || name === 'thirdweb' || name === 'uniblock') {
        return `/img/ecosystem/${name}.svg`;
      }

      // Get dynamic icon path
      const iconPath = await loadIconFromContext(name);
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
          loadIconFromContext(iconName);
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
          loadIconFromContext(name);
        }
      },
    };
  }, []);
}
