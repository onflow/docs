import { type SDKCardProps } from '../../ui/design-system/src/lib/Components/SDKCard';
const ToolCliIconSrc = '/images/tools/tool-cli.svg';
const ToolEmulatorIconSrc = '/images/tools/tool-emulator.svg';
const ToolFclIconSrc = '/images/tools/tool-fcl.svg';
const ToolTestingIconSrc = '/images/tools/tool-testing.svg';
const ToolVsCodeIconSrc = '/images/tools/tool-vscode.svg';
const ToolPortIconSrc = '/images/tools/tool-port.svg';
const CodeIcon = '/images/tools/tool-default.svg';

// TODO: Move somewhere else!
export type Tool = SDKCardProps & {
  repo?: {
    owner: string;
    name: string;
  };
};

// NOTE: Tool properties may be mutated during the application lifecycle
// See the `refreshTool` and `refreshTools` functions in `app/cms/tools.server.ts`.

// Flow Dev Tools
const cliTool: Tool = {
  repo: {
    name: 'flow-cli',
    owner: 'onflow',
  },
  title: 'CLI',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['documentation', 'active', 'required'],
  link: '/tools/flow-cli/',
  stars: 171,
  iconSrc: ToolCliIconSrc,
  description:
    'Flow CLI brings Flow to your terminal. Easily interact with the network and build your dapps.',
};

const emulatorTool: Tool = {
  repo: {
    name: 'flow-emulator',
    owner: 'onflow',
  },
  title: 'Emulator',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['documentation', 'active', 'local-dev'],
  link: '/tools/emulator/',
  stars: 62,
  iconSrc: ToolEmulatorIconSrc,
  description:
    'The Flow Emulator is a lightweight tool that emulates the behavior of the real Flow network. Packaged via CLI.',
};

const vsCodeTool: Tool = {
  repo: {
    name: 'vscode-extension',
    owner: 'onflow',
  },
  title: 'VS Code Extension',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['documentation', 'active', 'local-dev'],
  link: '/tools/vscode-extension',
  stars: 33,
  iconSrc: ToolVsCodeIconSrc,
  description:
    'The Visual Studio Code extension for Cadence. Extensive features such as code generation, deploying contracts, and a lot more.',
};

const intellijTool: Tool = {
  repo: {
    name: 'cadence-for-intellij-platform',
    owner: 'cadence-tools',
  },
  title: 'Intellij Cadence Plugin',
  authorIcon: 'https://avatars.githubusercontent.com/u/92172623?s=200&v=4',
  authorName: 'cadence-tools',
  tags: ['documentation'],
  link: 'https://github.com/cadence-tools/cadence-for-intellij-platform',
  stars: 6,
  iconSrc:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/IntelliJ_IDEA_Icon.svg/1024px-IntelliJ_IDEA_Icon.svg.png',
  description:
    'Support for Cadence, the resource-oriented smart contract language of Flow, in Intellij Platform IDEs.',
};

const commandLineLinter: Tool = {
  repo: {
    name: 'cadence-lint',
    owner: 'samatechtw',
  },
  title: 'Command Line Cadence Linter',
  authorIcon: 'https://avatars.githubusercontent.com/u/76526021?s=200&v=4',
  authorName: 'samatechtw',
  tags: ['documentation', 'local-dev'],
  link: 'https://github.com/samatechtw/cadence-lint',
  stars: 3,
  iconSrc: CodeIcon,
  description: 'CLI linter for Cadence projects and files.',
};

const cdcWebpackPlugin: Tool = {
  repo: {
    name: 'cadence-webpack-plugin',
    owner: 'agencyenterprise',
  },
  title: 'Cadence Webpack Plugin',
  authorIcon: 'https://avatars.githubusercontent.com/u/831220?s=200&v=4',
  authorName: 'agencyenterprise',
  tags: ['javascript', 'webpack', 'cadence'],
  link: 'https://github.com/agencyenterprise/cadence-webpack-plugin',
  stars: 6,
  iconSrc: CodeIcon,
  description: 'Webpack plugin that helps importing Cadence files.',
};

const cadutTool: Tool = {
  repo: {
    name: 'flow-cadut',
    owner: 'onflow',
  },
  title: 'Flow Cadut',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['documentation', 'active'],
  link: 'https://github.com/onflow/flow-cadut',
  stars: 13,
  iconSrc: CodeIcon,
  description:
    'Node based template generator to simplify interaction with Cadence files.',
};

const faucetTool: Tool = {
  repo: {
    name: 'faucet',
    owner: 'onflow',
  },
  title: 'Faucet',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['service', 'testnet'],
  link: 'https://testnet-faucet.onflow.org',
  stars: 13,
  iconSrc: 'https://testnet-faucet.onflow.org/testnet-faucet-icon.svg',
  description: 'Create and fund your testnet account with testnet FLOW.',
};

// SDKs
const fclSDK: Tool = {
  repo: {
    name: 'fcl-js',
    owner: 'onflow',
  },
  title: 'Javascript SDK (FCL)',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['documentation', 'active'],
  link: '/tools/clients/fcl-js',
  stars: 268,
  iconSrc: ToolFclIconSrc,
};

const goSDK: Tool = {
  repo: {
    name: 'flow-go-sdk',
    owner: 'onflow',
  },
  title: 'Go SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['documentation', 'active'],
  link: '/tools/clients/flow-go-sdk',
  stars: 186,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
};

const jvmSDK: Tool = {
  repo: {
    name: 'flow-jvm-sdk',
    owner: 'onflow',
  },
  title: 'Kotlin SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/80722240?s=200&v=4',
  authorName: 'The NFT Company',
  tags: ['examples', 'active'],
  link: 'https://github.com/onflow/flow-jvm-sdk',
  stars: 11,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
};

const httpSDK: Tool = {
  repo: {
    name: 'flow-go',
    owner: 'onflow',
  },
  title: 'HTTP API',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['active', 'documentation'],
  link: '/http-api/',
  stars: 417,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
};

const pythonSDK: Tool = {
  repo: {
    name: 'flow-py-sdk',
    owner: 'janezpodhostnik',
  },
  title: 'Python SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/67895329?v=4',
  authorName: 'janezpodhostnik',
  tags: ['documentation', 'active'],
  link: 'https://github.com/janezpodhostnik/flow-py-sdk',
  stars: 24,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
};

const dartSDK: Tool = {
  repo: {
    name: 'flow-dart-sdk',
    owner: 'MaxStalker',
  },
  title: 'Dart SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/3136647?s=48&v=4',
  authorName: 'MaxStalker',
  tags: ['documentation', 'active'],
  link: 'https://github.com/MaxStalker/flow-dart-sdk',
  stars: 8,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
};

const rustSDK: Tool = {
  repo: {
    name: 'flow.rs',
    owner: 'fee1-dead',
  },
  title: 'Rust SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/43851243?s=48&v=4',
  authorName: 'fee1-dead',
  tags: ['documentation'],
  link: 'https://github.com/fee1-dead/flow.rs',
  stars: 5,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
};

const rubySDK: Tool = {
  repo: {
    name: 'flow_client',
    owner: 'glucode',
  },
  title: 'Ruby SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/1345497?s=200&v=4',
  authorName: 'glucode',
  tags: ['documentation'],
  link: 'https://github.com/glucode/flow_client',
  stars: 8,
  iconSrc:
    'https://raw.githubusercontent.com/glucode/flow_client/main/logo%402x.png',
};

const elixirSDK: Tool = {
  repo: {
    name: 'on_flow',
    owner: 'nkezhaya',
  },
  title: 'Elixir SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/20113?s=48&v=4',
  authorName: 'nkezhaya',
  tags: ['documentation'],
  link: 'https://github.com/nkezhaya/on_flow',
  stars: 3,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg',
};

const swiftSDK: Tool = {
  repo: {
    name: 'flow-swift',
    owner: 'Outblock',
  },
  title: 'Swift SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/94294508?s=200&v=4',
  authorName: 'Outblock',
  tags: ['documentation', 'active'],
  link: 'https://github.com/Outblock/flow-swift',
  stars: 5,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
};

const dotNetSDK: Tool = {
  repo: {
    name: 'flow.net',
    owner: 'tyronbrand',
  },
  title: '.NET SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/44845449?s=48&v=4',
  authorName: 'tyronbrand',
  tags: ['documentation', 'active'],
  link: 'https://github.com/tyronbrand/flow.net',
  stars: 7,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
};

const phpSDK: Tool = {
  repo: {
    name: 'flow-php-sdk',
    owner: 'mayvenstudios',
  },
  title: 'PHP SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/17953578?s=200&v=4',
  authorName: 'mayvenstudios',
  tags: ['in-development'],
  link: 'https://github.com/mayvenstudios/flow-php-sdk',
  stars: 7,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg',
};

// Community Tools
const niftoryTool: Tool = {
  repo: {
    name: 'niftory',
    owner: 'niftory',
  },
  title: 'Niftory',
  tags: ['api', 'graphql', 'hosted'],
  link: 'https://www.niftory.com/',
  iconSrc:
    'https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3595744636-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fcollections%252FclIQYZoyHeuXbkEoeS0N%252Ficon%252Fl85XoAUq99rpOulJCFqu%252Fniftory-sq_icon-azF5SY.png%3Falt%3Dmedia%26token%3D03613aae-415f-41b4-9c7e-e5988177e095',
  description: `Blazing-fast GraphQL APIs to query/mint/airdrop NFTs, create custodial wallets, handle user auth, and more!`,
};

const flowviewTool: Tool = {
  repo: {
    name: 'flowview',
    owner: 'flowview',
  },
  authorIcon: 'https://avatars.githubusercontent.com/u/102154433?s=200&v=4',
  authorName: '33 Labs',
  stars: 5,
  title: 'Flowview',
  tags: ['explorer', 'GUI'],
  link: 'https://www.flowview.app/',
  iconSrc: 'https://www.flowview.app/_next/image?url=%2Flogo.png&w=640&q=75',
  description: `An interactive view to visualize and inspect storage on Flow Accounts`,
};

const overflowTool: Tool = {
  repo: {
    name: 'overflow',
    owner: 'bjartek',
  },
  title: 'Overflow',
  authorIcon: 'https://avatars.githubusercontent.com/u/10621?v=4',
  authorName: 'bjartek',
  tags: ['Go', 'testing', 'cadence'],
  link: 'https://github.com/bjartek/overflow',
  stars: 17,
  iconSrc: CodeIcon,
  description:
    'Test your Cadence logic with a go-based testing framework made specifically for Flow.',
};

const flowserTool: Tool = {
  repo: {
    name: 'flowser',
    owner: 'onflowser',
  },
  title: 'Flowser',
  authorIcon: 'https://docs.flowser.dev/img/logo.svg',
  authorName: 'onflowser',
  tags: ['GUI', 'explorer', 'local'],
  link: 'https://docs.flowser.dev/',
  stars: 28,
  iconSrc: 'https://docs.flowser.dev/img/logo.svg',
  description: `Flowser lets you inspect the current state of any flow blockchain network emulator, testnet, and mainnet.`,
};

const flowRunnerTool: Tool = {
  repo: {
    name: 'flow-runner',
    owner: 'prpatel05',
  },
  title: 'Flow Runner',
  authorIcon: 'https://avatars.githubusercontent.com/u/2936161?v=4',
  authorName: 'prpatel05',
  tags: ['GUI', 'cadence', 'browser'],
  link: 'https://github.com/prpatel05/flow-runner',
  stars: 0,
  iconSrc: CodeIcon,
  description:
    'Run Cadence scripts and transactions directly from your browser!',
};

// Explorers
const flowScanTool: Tool = {
  title: 'Flowscan',
  tags: ['metrics', 'lookup', 'mainnet'],
  link: 'https://flowscan.io/',
  iconSrc:
    'https://pbs.twimg.com/profile_images/1693654862536331264/ViqtN5qj_400x400.jpg',
  description: `Flowscan is a blockchain explorer that lets you browse all on-chain events, transactions, contracts, and accounts.`,
};

const flowViewSourceTool: Tool = {
  repo: {
    name: 'flow-view-source',
    owner: 'orodio',
  },
  title: 'Flow View Source',
  tags: ['lookup', 'open-source'],
  authorIcon: 'https://avatars.githubusercontent.com/u/1102494?s=48&v=4',
  authorName: 'orodio',
  stars: 15,
  link: 'https://github.com/orodio/flow-view-source',
  iconSrc: CodeIcon,
  description: `Flow view source is a blockchain explorer that's open sourced and connected to FCL for running transactions.`,
};

// oss services
const walletApiTool: Tool = {
  repo: {
    name: 'flow-wallet-api',
    owner: 'flow-hydraulics',
  },
  title: 'Flow Wallet API',
  authorIcon: 'https://avatars.githubusercontent.com/u/88199046?s=200&v=4',
  authorName: 'flow-hydraulics',
  tags: ['Go', 'api', 'open-source', 'documentation'],
  link: 'https://github.com/flow-hydraulics/flow-wallet-api',
  stars: 30,
  iconSrc: CodeIcon,
  description:
    'Service for managing custodial and admin wallets on the Flow blockchain. Configurable with GCP and AWS KMS.',
};

const eventIndexingTool: Tool = {
  repo: {
    name: 'flow-scanner',
    owner: 'rayvin-flow',
  },
  title: 'Flow Scanner',
  authorIcon: 'https://avatars.githubusercontent.com/u/93519414?s=200&v=4',
  authorName: 'rayvin-flow',
  tags: ['typescript', 'api', 'open-source', 'documentation'],
  link: 'https://github.com/rayvin-flow/flow-scanner',
  stars: 9,
  iconSrc: CodeIcon,
  description:
    'Service that can monitor the Flow blockchain for one or more Cadence event types and broadcast them.',
};

const accountApiTool: Tool = {
  repo: {
    name: 'flow-account-api',
    owner: 'onflow',
  },
  title: 'Flow Account API',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['go', 'api'],
  link: 'https://github.com/onflow/flow-account-api',
  stars: 3,
  iconSrc: CodeIcon,
  description:
    'API for non-custodial Flow wallets to create accounts and maintain a registry of public key to account address.',
};

const flowMarketplaceMonitorTool: Tool = {
  repo: {
    name: 'FlowMarketplaceEventMonitor',
    owner: 'ph0ph0',
  },
  title: 'Flow Event Monitor - Marketplace',
  authorIcon: 'https://avatars.githubusercontent.com/u/20524533?s=48&v=4',
  authorName: 'ph0ph0',
  tags: ['aws', 'api', 'documentation'],
  link: 'https://github.com/ph0ph0/FlowMarketplaceEventMonitor',
  stars: 8,
  iconSrc: CodeIcon,
  description:
    'An AWS Cloudformation stack that listens to Flow events and stores them for querying.',
};

const graffleTool: Tool = {
  title: 'Graffle',
  tags: ['api', 'hosted', 'webhooks'],
  link: 'https://graffle.io/',
  iconSrc: 'https://graffle.io/static/brand/logo_single.svg',
  description: `Hosted infrastructure and APIs to index, monitor and store on-chain events alongside other extensive features.`,
};

const flowPortTool: Tool = {
  title: 'Flow Port',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'mini flow',
  tags: ['Tool'],
  link: 'https://port.onflow.org/',
  iconSrc: ToolPortIconSrc,
  description: 'Your portal to the decentralized world of Flow.',
};

const dapperWallet: Tool = {
  title: 'Dapper Wallet',
  tags: ['web', 'wallet', 'custodial'],
  link: 'https://www.meetdapper.com/',
  iconSrc:
    'https://assets.website-files.com/60796227183fcb19c208916e/611ac35ed3af7095b0e0deee_Dapper.png',
  description:
    'Easy and securely buy and store digital assets from groundbreaking Flow apps and games',
};

const bloctoWallet: Tool = {
  title: 'Blocto',
  tags: ['web', 'android', 'ios', 'wallet', 'custodial'],
  link: 'https://blocto.portto.io/en/',
  iconSrc: 'https://token.blocto.app/img/logo.png',
  description:
    'Manage your crypto, dApps, and NFT all-in-once through Blocto, the cross-chain crypto wallet',
};

const ledgerWallet: Tool = {
  title: 'Ledger',
  tags: ['hardware', 'wallet', 'non-custodial'],
  link: 'https://www.ledger.com/',
  iconSrc:
    'https://www.ledger.com/wp-content/uploads/2021/11/Ledger_favicon.png',
  description:
    'The hardware wallet to secure, buy, exchange, and grow your crypto assets',
};

const nufiWallet: Tool = {
  title: 'NuFi',
  tags: ['web', 'extension', 'wallet', 'non-custodial'],
  link: 'https://nu.fi/',
  iconSrc: 'https://nu.fi/resources/nufi-logo-round-bg-dark.svg',
  description:
    "Flow's only non-custodial wallet with staking, NFT gallery, dApp connector and Ledger HW support.",
};

const dapperSelfCustodyWallet: Tool = {
  title: 'Dapper Self Custody (BETA)',
  tags: ['wallet', 'non-custodial', 'mobile', 'ios', 'android'],
  link: 'https://www.meetdapper.com/dapper-self-custody',
  iconSrc: '/images/tools/tool-dapper-self-custody.svg',
  description:
    'A mobile self custody wallet to help you explore the world of Flow',
};

const flowWallet: Tool = {
  title: 'Flow Wallet',
  tags: ['web', 'extension', 'wallet', 'non-custodial'],
  link: 'https://wallet.flow.com/',
  iconSrc: 'https://lilico.app/logo_mobile.svg',
  description:
    'A reference wallet created for everyone. Trusted. Battle-tested. Beautifully designed.',
};

const fionaWallet: Tool = {
  title: 'Finoa',
  tags: ['institutional', 'wallet', 'custodial'],
  link: 'https://www.finoa.io/flow/',
  iconSrc: 'https://www.finoa.io/icons/icon-512x512.png?v=1659609128276',
  description: 'Safely store and stake your Flow tokens with Finoa',
};

const unitySDK: Tool = {
  repo: {
    name: 'UnityFlowSDK',
    owner: 'onflow',
  },
  title: 'Unity SDK',
  authorIcon: 'https://avatars.githubusercontent.com/u/62387156?s=64&v=4',
  authorName: 'onflow',
  tags: ['documentation'],
  link: '/tools/clients/unity-sdk',
  stars: 4,
  iconSrc:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg',
};

export {
  flowserTool,
  overflowTool,
  flowRunnerTool,
  dotNetSDK,
  swiftSDK,
  rustSDK,
  rubySDK,
  elixirSDK,
  httpSDK,
  jvmSDK,
  goSDK,
  pythonSDK,
  phpSDK,
  dartSDK,
  fclSDK,
  cliTool,
  emulatorTool,
  jsTestingLibTool,
  cadutTool,
  faucetTool,
  flowScanTool,
  flowViewSourceTool,
  walletApiTool,
  eventIndexingTool,
  accountApiTool,
  flowMarketplaceMonitorTool,
  intellijTool,
  vsCodeTool,
  commandLineLinter,
  cdcWebpackPlugin,
  graffleTool,
  flowPortTool,
  bloctoWallet,
  dapperWallet,
  ledgerWallet,
  nufiWallet,
  flowWallet,
  fionaWallet,
  niftoryTool,
  flowviewTool,
  dapperSelfCustodyWallet,
};
