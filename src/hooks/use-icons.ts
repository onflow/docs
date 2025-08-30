import { useMemo } from 'react';
import { IconName } from '@site/src/types/icons';

// Static icon paths - more reliable than dynamic imports
const getIconPath = (name: IconName): string | null => {
  switch (name) {
    // BuildGridData icons
    case IconName.GETTING_STARTED:
      return '/images/icons/getting-started.svg';
    case IconName.WHY_FLOW:
      return '/images/icons/why-flow.svg';
    case IconName.HELLO_WORLD:
      return '/images/icons/hello-world.svg';
    case IconName.FLOW_CADENCE:
      return '/images/icons/flow-cadence.svg';
    case IconName.EVM_ON_FLOW:
      return '/images/icons/evm-on-flow.svg';
    case IconName.RANDOM:
      return '/images/icons/random.svg';
    case IconName.BATCHED_EVM_TRANSACTIONS:
      return '/images/icons/batched-evm-transactions.svg';
    case IconName.FLOW_CLIENT_LIBRARY:
      return '/images/icons/flow-client-library.svg';
    case IconName.TOOLS:
      return '/images/icons/flow-tools.svg';
    case IconName.FAUCET:
      return '/images/icons/Faucet.svg';
    
    // GrowGridData icons
    case IconName.GROW:
      return '/images/icons/flow-grow.svg';
    case IconName.BUILDER_CREDITS:
      return '/images/icons/builder-credits.svg';
    case IconName.DEV_OFFICE_HOURS:
      return '/images/icons/dev-office-hours.svg';
    case IconName.GRANTS:
      return '/images/icons/flow-grants.svg';
    case IconName.STARTUP_SUPPORT:
      return '/images/icons/startup-support.svg';
    case IconName.VCS_AND_FUNDS:
      return '/images/icons/vcs-&-funds.svg';
    
    // Other commonly used icons
    case IconName.LEARN:
      return '/images/icons/flow-learn.svg';
    case IconName.GS_HELLO_WORLD:
      return '/images/icons/gs-hello-world.svg';
    case IconName.CADENCE:
      return '/images/icons/cadence-logo-mark-black-1.svg';
    case IconName.SOLIDITY:
      return '/images/icons/flow-evm.svg';
    
    // Feature icons
    case IconName.FEATURE_WHY_FLOW_ICON:
      return '/images/icons/feature-why-flow-icon.svg';
    case IconName.FEATURE_WAND_ICON:
      return '/images/icons/feature-wand-icon.svg';
    case IconName.FEATURE_STACKS_ICON:
      return '/images/icons/feature-stacks-icon.svg';
    case IconName.FEATURE_CODE_SCRIPTS_ICON:
      return '/images/icons/feature-code-scripts-icon.svg';
    case IconName.FEATURE_EVM_ICON:
      return '/images/icons/feature-evm-icon.svg';
    
    // Other icons
    case IconName.ROADMAP:
      return '/images/icons/roadmap.svg';
    case IconName.CADENCE_COURSE:
      return '/images/icons/cadence-course.svg';
    case IconName.START_HERE:
      return '/images/icons/start-here.svg';
    case IconName.PATH_QUEST:
      return '/images/icons/path-quest.svg';
    case IconName.LANG_REFERENCE:
      return '/images/icons/lang-reference.svg';
    case IconName.FLOW_ASSISTANT_GPT:
      return '/images/icons/flow-assistant-gpt.svg';
    case IconName.DEVELOPER_CHAT:
      return '/images/icons/developer-chat.svg';
    case IconName.NETWORK_UPGRADE:
      return '/images/icons/network-upgrade.svg';
    case IconName.TUTORIALS:
      return '/images/icons/tutorials.svg';
    case IconName.CROSS_VM_BRIDGE:
      return '/images/icons/cross-vm-bridge.svg';
    case IconName.FORUM:
      return '/images/icons/forum.svg';
    
    // Social media icons
    case IconName.DISCORD:
      return '/images/icons/discord.svg';
    case IconName.X_COM:
      return '/images/icons/x.com.svg';
    case IconName.GITHUB:
      return '/images/icons/github.svg';
    
    default:
      return null;
  }
};

// Cache for loaded icons
const iconCache = new Map<string, any>();

export function useIcons() {
  return useMemo(() => {
    const loadIcon = (name: IconName) => {
      // Check cache first
      if (iconCache.has(name)) {
        return iconCache.get(name);
      }

      // Check if it's a static path
      if (name === IconName.QUICKNODE || name === IconName.OLYMPIX_LOGO || name === IconName.FLOW || name === IconName.ALCHEMY || name === IconName.THIRDWEB || name === IconName.UNIBLOCK) {
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
      const commonIcons = [IconName.GETTING_STARTED, IconName.GROW, IconName.TOOLS, IconName.LEARN];
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
      getIcon: (name: IconName) => iconCache.get(name) || null,
      // Preload specific icons
      preloadIcon: (name: IconName) => {
        if (!iconCache.has(name)) {
          getIconPath(name);
        }
      },
    };
  }, []);
}
