import { useMemo } from 'react';

// Direct imports
import AccessIncredibleIPIcon from '/static/images/icons/access-incredible-ip.svg';
import AccountAbstractionIcon from '/static/images/icons/account-abstraction.svg';
import BatchedEVMTransactionsIcon from '/static/images/icons/batched-evm-transactions.svg';
import BuilderCreditsIcon from '/static/images/icons/builder-credits.svg';
import CadenceLogoIcon from '/static/images/icons/cadence-logo-mark-black-1.svg';
import CreateNFTIcon from '/static/images/icons/create-an-nft.svg';
import CrossVMBridgeIcon from '/static/images/icons/cross-vm-bridge.svg';
import DevOfficeHoursIcon from '/static/images/icons/dev-office-hours.svg';
import EVMToolsIcon from '/static/images/icons/evm-tools.svg';
import EVMOnFlowIcon from '/static/images/icons/evm-on-flow.svg';
import FlowCLIIcon from '/static/images/icons/flow-cli.svg';
import FlowCadenceIcon from '/static/images/icons/flow-cadence.svg';
import FlowClientLibraryIcon from '/static/images/icons/flow-client-library.svg';
import FlowEVMIcon from '/static/images/icons/flow-evm.svg';
import FlowEmulatorIcon from '/static/images/icons/flow-emulator.svg';
import FlowProtocolIcon from '/static/images/icons/flow-protocol.svg';
import FundIcon from '/static/images/icons/fund.svg';
import GSHelloWorldIcon from '/static/images/icons/gs-hello-world.svg';
import GettingStartedIcon from '/static/images/icons/getting-started.svg';
import GrantsIcon from '/static/images/icons/grants.svg';
import GrowIcon from '/static/images/icons/grow.svg';
import HackathonsIcon from '/static/images/icons/hackathons.svg';
import HelloWorldIcon from '/static/images/icons/hello-world.svg';
import LaunchTokenIcon from '/static/images/icons/launch-a-token.svg';
import LearnIcon from '/static/images/icons/learn.svg';
import OtherClientsIcon from '/static/images/icons/other-clients.svg';
import StartupSupportIcon from '/static/images/icons/startup-support.svg';
import SuperchargeIcon from '/static/images/icons/supercharge.svg';
import ToolsIcon from '/static/images/icons/tools.svg';
import TutorialsIcon from '/static/images/icons/tutorials.svg';
import VCsFundsIcon from '/static/images/icons/vcs-&-funds.svg';
import VRFCadenceIcon from '/static/images/icons/vrf---cadence.svg';
import VRFEVMIcon from '/static/images/icons/vrf---evm.svg';
import WhyFlowIcon from '/static/images/icons/why-flow.svg';

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
  }), []);
}
