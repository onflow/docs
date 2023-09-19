import { type TutorialCardProps } from '../../ui/design-system/src/lib/Components/TutorialCard';
import {
  accessControlCadence,
  cadenceAtAGlance,
  playgroundTutorials,
  FCLQuickstartNextJs,
  FCLQuickstartNuxtJs,
  FCLQuickstartSvelteKit,
  firstStepsWithCadence,
  flowMetaDataStandard,
  flowMultiNodeArchitecture,
  flowNFTPetStore,
  getTheFlowDown,
  guideToFlowForEthereumUsers,
  introToFlow,
  learnCadenceVideoSeries,
  NBATopShotExample,
  organizingCadenceTutorial,
  redSquirrelGetStartedArticle,
  revolutionizeSmartContractProgramming,
  zeroToJacobFlow,
} from '../../data/articles';
import { type VideoCardErrorProps } from '@site/src/ui/design-system/src/lib/Components/VideoCard/VideoCardError';
export interface LargeVideoCardProps {
  link: string; // NOTE: link should be in the format that youtubes site uses ie: https://www.youtube.com/watch?v=...
  title: string;
  length: number; // seconds
  className?: string;
  errorBehavior?: VideoCardErrorProps['behavior'];
}
export interface SmallVideoCardProps extends LargeVideoCardProps {
  tags: string[];
}

export const cadenceTutorials: TutorialCardProps[] = [
  cadenceAtAGlance,
  playgroundTutorials,
  organizingCadenceTutorial,
  learnCadenceVideoSeries,
  zeroToJacobFlow,
  firstStepsWithCadence,
  FCLQuickstartNextJs,
  FCLQuickstartNuxtJs,
  FCLQuickstartSvelteKit,
];

export const nftTutorials: TutorialCardProps[] = [
  NBATopShotExample,
  redSquirrelGetStartedArticle,
  flowNFTPetStore,
  flowMetaDataStandard,
];

export const architectureTutorials: TutorialCardProps[] = [
  introToFlow,
  flowMultiNodeArchitecture,
  getTheFlowDown,
  guideToFlowForEthereumUsers,
  revolutionizeSmartContractProgramming,
  accessControlCadence,
];

export const videos: {
  primary: LargeVideoCardProps;
  secondary: SmallVideoCardProps[];
} = {
  primary: {
    link: 'https://www.youtube.com/watch?v=pRz7EzrWchs',
    title: 'Learn Cadence - Hello World on Flow',
    length: 1396,
  },
  secondary: [
    {
      link: 'https://www.youtube.com/watch?v=DInibYmxUsc',
      title: 'Fungible Token Smart Contracts on Flow',
      length: 1993,
      tags: ['Guide'],
    },
    {
      link: 'https://www.youtube.com/watch?v=uEoh9SnjqCk',
      title: 'How to build a basic web3 app on Flow',
      length: 1878,
      tags: ['Guide'],
    },
  ],
};

export const allTutorials: TutorialCardProps[] = [
  ...nftTutorials,
  ...cadenceTutorials,
  ...architectureTutorials,
];
