import { IconName } from '@site/src/types/icons';

// Simple object map for icon paths - much cleaner than switch statements
const iconMap: Record<IconName, string> = {
  // BuildGridData icons
  [IconName.GETTING_STARTED]: '/images/icons/getting-started.svg',
  [IconName.WHY_FLOW]: '/images/icons/why-flow.svg',
  [IconName.HELLO_WORLD]: '/images/icons/hello-world.svg',
  [IconName.FLOW_CADENCE]: '/images/icons/flow-cadence.svg',
  [IconName.EVM_ON_FLOW]: '/images/icons/evm-on-flow.svg',
  [IconName.RANDOM]: '/images/icons/random.svg',
  [IconName.BATCHED_EVM_TRANSACTIONS]: '/images/icons/batched-evm-transactions.svg',
  [IconName.FLOW_CLIENT_LIBRARY]: '/images/icons/flow-client-library.svg',
  [IconName.TOOLS]: '/images/icons/flow-tools.svg',
  [IconName.FAUCET]: '/images/icons/Faucet.svg',
  
  // GrowGridData icons
  [IconName.GROW]: '/images/icons/flow-grow.svg',
  [IconName.BUILDER_CREDITS]: '/images/icons/builder-credits.svg',
  [IconName.DEV_OFFICE_HOURS]: '/images/icons/dev-office-hours.svg',
  [IconName.GRANTS]: '/images/icons/flow-grants.svg',
  [IconName.STARTUP_SUPPORT]: '/images/icons/startup-support.svg',
  [IconName.VCS_AND_FUNDS]: '/images/icons/vcs-&-funds.svg',
  
  // Other commonly used icons
  [IconName.LEARN]: '/images/icons/flow-learn.svg',
  [IconName.GS_HELLO_WORLD]: '/images/icons/gs-hello-world.svg',
  [IconName.CADENCE]: '/images/icons/cadence-logo-mark-black-1.svg',
  [IconName.SOLIDITY]: '/images/icons/flow-evm.svg',
  
  // Feature icons
  [IconName.FEATURE_WHY_FLOW_ICON]: '/images/icons/feature-why-flow-icon.svg',
  [IconName.FEATURE_WAND_ICON]: '/images/icons/feature-wand-icon.svg',
  [IconName.FEATURE_STACKS_ICON]: '/images/icons/feature-stacks-icon.svg',
  [IconName.FEATURE_CODE_SCRIPTS_ICON]: '/images/icons/feature-code-scripts-icon.svg',
  [IconName.FEATURE_EVM_ICON]: '/images/icons/feature-evm-icon.svg',
  
  // Other icons
  [IconName.ROADMAP]: '/images/icons/roadmap.svg',
  [IconName.CADENCE_COURSE]: '/images/icons/cadence-course.svg',
  [IconName.START_HERE]: '/images/icons/start-here.svg',
  [IconName.PATH_QUEST]: '/images/icons/path-quest.svg',
  [IconName.LANG_REFERENCE]: '/images/icons/lang-reference.svg',
  [IconName.FLOW_ASSISTANT_GPT]: '/images/icons/flow-assistant-gpt.svg',
  [IconName.DEVELOPER_CHAT]: '/images/icons/developer-chat.svg',
  [IconName.NETWORK_UPGRADE]: '/images/icons/network-upgrade.svg',
  [IconName.TUTORIALS]: '/images/icons/tutorials.svg',
  [IconName.CROSS_VM_BRIDGE]: '/images/icons/cross-vm-bridge.svg',
  [IconName.FORUM]: '/images/icons/forum.svg',
  
  // Social media icons
  [IconName.DISCORD]: '/images/icons/discord.svg',
  [IconName.X_COM]: '/images/icons/x.com.svg',
  [IconName.GITHUB]: '/images/icons/github.svg',
  
  // Ecosystem icons (these use a different path pattern)
  [IconName.QUICKNODE]: '/img/ecosystem/quicknode.svg',
  [IconName.OLYMPIX_LOGO]: '/img/ecosystem/olympix-logo.svg',
  [IconName.FLOW]: '/img/ecosystem/flow.svg',
  [IconName.ALCHEMY]: '/img/ecosystem/alchemy.svg',
  [IconName.THIRDWEB]: '/img/ecosystem/thirdweb.svg',
  [IconName.UNIBLOCK]: '/img/ecosystem/uniblock.svg',
};

export function useIcons() {
  return {
    getIcon: (name: IconName): string | null => {
      return iconMap[name] || null;
    },
  };
}
