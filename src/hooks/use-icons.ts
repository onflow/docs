import { useMemo } from 'react';

// Direct imports
import AccessIncredibleIPIcon from '/static/images/icons/Access Incredible IP.svg';
import AccountAbstractionIcon from '/static/images/icons/Account Abstraction.svg';
import BatchedEVMTransactionsIcon from '/static/images/icons/Batched EVM Transactions.svg';
import BuilderCreditsIcon from '/static/images/icons/Builder Credits.svg';
import CadenceLogoIcon from '/static/images/icons/Cadence_Logo Mark_Black 1.svg';
import CreateNFTIcon from '/static/images/icons/Create an NFT.svg';
import CrossVMBridgeIcon from '/static/images/icons/Cross-VM Bridge.svg';
import DevOfficeHoursIcon from '/static/images/icons/Dev Office Hours.svg';
import EVMToolsIcon from '/static/images/icons/EVM Tools.svg';
import EVMOnFlowIcon from '/static/images/icons/EVM on Flow.svg';
import FlowCLIIcon from '/static/images/icons/Flow CLI.svg';
import FlowCadenceIcon from '/static/images/icons/Flow Cadence.svg';
import FlowClientLibraryIcon from '/static/images/icons/Flow Client Library.svg';
import FlowEVMIcon from '/static/images/icons/Flow EVM.svg';
import FlowEmulatorIcon from '/static/images/icons/Flow Emulator.svg';
import FlowProtocolIcon from '/static/images/icons/Flow Protocol.svg';
import FundIcon from '/static/images/icons/Fund.svg';
import GSHelloWorldIcon from '/static/images/icons/GS Hello World.svg';
import GettingStartedIcon from '/static/images/icons/Getting Started.svg';
import GrantsIcon from '/static/images/icons/Grants.svg';
import GrowIcon from '/static/images/icons/Grow.svg';
import HackathonsIcon from '/static/images/icons/Hackathons.svg';
import HelloWorldIcon from '/static/images/icons/Hello World.svg';
import LaunchTokenIcon from '/static/images/icons/Launch a Token.svg';
import LearnIcon from '/static/images/icons/Learn.svg';
import OtherClientsIcon from '/static/images/icons/Other Clients.svg';
import StartupSupportIcon from '/static/images/icons/Startup Support.svg';
import SuperchargeIcon from '/static/images/icons/Supercharge.svg';
import ToolsIcon from '/static/images/icons/Tools.svg';
import TutorialsIcon from '/static/images/icons/Tutorials.svg';
import VCsFundsIcon from '/static/images/icons/VCs & Funds.svg';
import VRFCadenceIcon from '/static/images/icons/VRF - Cadence.svg';
import VRFEVMIcon from '/static/images/icons/VRF - EVM.svg';
import WhyFlowIcon from '/static/images/icons/Why Flow.svg';

export function useIcons() {
    return useMemo(() => ({
        'Access Incredible IP': AccessIncredibleIPIcon,
        'Account Abstraction': AccountAbstractionIcon,
        'Batched EVM Transactions': BatchedEVMTransactionsIcon,
        'Builder Credits': BuilderCreditsIcon,
        'Cadence_Logo Mark_Black 1': CadenceLogoIcon,
        'Create an NFT': CreateNFTIcon,
        'Cross-VM Bridge': CrossVMBridgeIcon,
        'Dev Office Hours': DevOfficeHoursIcon,
        'EVM Tools': EVMToolsIcon,
        'EVM on Flow': EVMOnFlowIcon,
        'Flow CLI': FlowCLIIcon,
        'Flow Cadence': FlowCadenceIcon,
        'Flow Client Library': FlowClientLibraryIcon,
        'Flow EVM': FlowEVMIcon,
        'Flow Emulator': FlowEmulatorIcon,
        'Flow Protocol': FlowProtocolIcon,
        'Fund': FundIcon,
        'GS Hello World': GSHelloWorldIcon,
        'Getting Started': GettingStartedIcon,
        'Grants': GrantsIcon,
        'Grow': GrowIcon,
        'Hackathons': HackathonsIcon,
        'Hello World': HelloWorldIcon,
        'Launch a Token': LaunchTokenIcon,
        'Learn': LearnIcon,
        'Other Clients': OtherClientsIcon,
        'Startup Support': StartupSupportIcon,
        'Supercharge': SuperchargeIcon,
        'Tools': ToolsIcon,
        'Tutorials': TutorialsIcon,
        'VCs & Funds': VCsFundsIcon,
        'VRF - Cadence': VRFCadenceIcon,
        'VRF - EVM': VRFEVMIcon,
        'Why Flow': WhyFlowIcon,
    }), []);
}
