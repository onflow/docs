export const STATUSPAGE_API_URL =
  'https://api.statuspage.io/v1/pages/ytw5bdg6zr13/components';
export const DISCOURSE_BREAKING_CHANGES_URL =
  'https://forum.onflow.org/c/announcements/breaking-changes/30.json';
export const DISCOURSE_MAINNET_SPORK_URL =
  'https://forum.onflow.org/c/mainnet-sporks/36.json';
export const DISCOURSE_LATEST_TOPICS_URL =
  'https://forum.onflow.org/latest.json';
export const DISCOURSE_API_URL = 'https://forum.onflow.org';
export const POLLING_INTERVAL_FIVE_SECONDS = 5 * 1000;

export const ABOUT_THIS_CATEGORY_BREAKING_CHANGES = 762;
export const ABOUT_THIS_CATEGORY_SPORK = 2543;

export const HIGHLIGHT_LANGUAGES = [
  'cadence',
  'swift',
  'markup',
  'bash',
  'clike',
  'c',
  'cpp',
  'css',
  'css-extras',
  'javascript',
  'jsx',
  'js-extras',
  'js-templates',
  'coffeescript',
  'diff',
  'git',
  'go',
  'graphql',
  'markup-templating',
  'handlebars',
  'json',
  'less',
  'makefile',
  'markdown',
  'objectivec',
  'ocaml',
  'python',
  'reason',
  'sass',
  'scss',
  'sql',
  'stylus',
  'tsx',
  'typescript',
  'wasm',
  'yaml',
];

export const DISCORD_URL = 'https://discord.gg/flow';
export const DISCORD_ANNOUNCEMENTS_CHANNEL_ID = '621529603718119424';
export const DISCORD_DEV_UPDATES_CHANNEL_ID = '811693600403357706';

export const GOLD_STAR_CHALLENGES = {
  LEARN_FLOW_CHALLENGE: {
    contractName: 'LearnFlowChallenge',
    resourceIdentifier: 'Challenge',
  },
};

export const CONTRACT_IDENTIFIER_REGEX =
  /^A\.(0x)?([0-9a-fA-F]{16})\.([a-zA-Z0-9_]+)$/;

export const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
