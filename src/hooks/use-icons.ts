import { useMemo } from 'react';

// Direct imports
import AccessIncredibleIPIcon from '@site/static/images/icons/access-incredible-ip.svg';
import AccountAbstractionIcon from '@site/static/images/icons/account-abstraction.svg';
import BatchedEVMTransactionsIcon from '@site/static/images/icons/batched-evm-transactions.svg';
import BuilderCreditsIcon from '@site/static/images/icons/builder-credits.svg';
import CadenceLogoIcon from '@site/static/images/icons/cadence-logo-mark-black-1.svg';
import CreateNFTIcon from '@site/static/images/icons/create-an-nft.svg';
import CrossVMBridgeIcon from '@site/static/images/icons/cross-vm-bridge.svg';
import DevOfficeHoursIcon from '@site/static/images/icons/dev-office-hours.svg';
import EVMToolsIcon from '@site/static/images/icons/evm-tools.svg';
import EVMOnFlowIcon from '@site/static/images/icons/evm-on-flow.svg';
import FlowCLIIcon from '@site/static/images/icons/flow-cli.svg';
import FlowCadenceIcon from '@site/static/images/icons/flow-cadence.svg';
import FlowClientLibraryIcon from '@site/static/images/icons/flow-client-library.svg';
import FlowEVMIcon from '@site/static/images/icons/flow-evm.svg';
import FlowEmulatorIcon from '@site/static/images/icons/flow-emulator.svg';
import FlowProtocolIcon from '@site/static/images/icons/flow-protocol.svg';
import FundIcon from '@site/static/images/icons/flow-fund.svg';
import GSHelloWorldIcon from '@site/static/images/icons/gs-hello-world.svg';
import GettingStartedIcon from '@site/static/images/icons/getting-started.svg';
import GrantsIcon from '@site/static/images/icons/flow-grants.svg';
import GrowIcon from '@site/static/images/icons/flow-grow.svg';
import HackathonsIcon from '@site/static/images/icons/flow-hackathons.svg';
import HelloWorldIcon from '@site/static/images/icons/hello-world.svg';
import LaunchTokenIcon from '@site/static/images/icons/launch-a-token.svg';
import LearnIcon from '@site/static/images/icons/flow-learn.svg';
import OtherClientsIcon from '@site/static/images/icons/other-clients.svg';
import StartupSupportIcon from '@site/static/images/icons/startup-support.svg';
import SuperchargeIcon from '@site/static/images/icons/flow-supercharge.svg';
import ToolsIcon from '@site/static/images/icons/flow-tools.svg';
import TutorialsIcon from '@site/static/images/icons/flow-tutorials.svg';
import VCsFundsIcon from '@site/static/images/icons/vcs-&-funds.svg';
import VRFCadenceIcon from '@site/static/images/icons/vrf---cadence.svg';
import VRFEVMIcon from '@site/static/images/icons/vrf---evm.svg';
import WhyFlowIcon from '@site/static/images/icons/why-flow.svg';
import RandomIcon from '@site/static/images/icons/random.svg';
import FaucetIcon from '@site/static/images/icons/Faucet.svg';

export function useIcons() {
  return useMemo(() => ({
    'access-incredible-ip': AccessIncredibleIPIcon,
    'account-abstraction': AccountAbstractionIcon,
    'batched-evm-transactions': BatchedEVMTransactionsIcon,
    'builder-credits': BuilderCreditsIcon,
    'cadence-logo-mark-black-1': CadenceLogoIcon,
    'create-an-nft': CreateNFTIcon,
    'cross-vm-bridge': CrossVMBridgeIcon,
    'dev-office-hours': DevOfficeHoursIcon,
    'evm-tools': EVMToolsIcon,
    'evm-on-flow': EVMOnFlowIcon,
    'flow-cli': FlowCLIIcon,
    'flow-cadence': FlowCadenceIcon,
    'flow-client-library': FlowClientLibraryIcon,
    'flow-evm': FlowEVMIcon,
    'flow-emulator': FlowEmulatorIcon,
    'flow-protocol': FlowProtocolIcon,
    'fund': FundIcon,
    'gs-hello-world': GSHelloWorldIcon,
    'getting-started': GettingStartedIcon,
    'grants': GrantsIcon,
    'grow': GrowIcon,
    'hackathons': HackathonsIcon,
    'hello-world': HelloWorldIcon,
    'launch-a-token': LaunchTokenIcon,
    'learn': LearnIcon,
    'other-clients': OtherClientsIcon,
    'startup-support': StartupSupportIcon,
    'supercharge': SuperchargeIcon,
    'tools': ToolsIcon,
    'tutorials': TutorialsIcon,
    'vcs-&-funds': VCsFundsIcon,
    'vrf---cadence': VRFCadenceIcon,
    'vrf---evm': VRFEVMIcon,
    'why-flow': WhyFlowIcon,
    'random': RandomIcon,
    'faucet': FaucetIcon,
    'quicknode': '/img/ecosystem/quicknode.svg',
    'olympix-logo': '/img/ecosystem/olympix-logo.svg',
    'flow': '/img/ecosystem/flow.svg',
    'alchemy': '/img/ecosystem/alchemy.svg',
    'thirdweb': '/img/ecosystem/thirdweb.svg',
    'uniblock': '/img/ecosystem/uniblock.svg',
  }), []);
}
