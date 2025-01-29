import React from 'react';
import {
  LandingHeaderHome,
} from '../../Components';
import { type ContentNavigationListProps } from '../../Components/ContentNavigationList';
import { type SocialLinksSignupProps } from '../../Components/SocialLinksSignup';
import { type TutorialCardProps } from '../../Components/TutorialCard';
import { type UpcomingEventsProps } from '../../Components/UpcomingEvents';
import PageBackground from '../shared/PageBackground';
import { ContentFeatureList } from '../../Components/ContentFeatureList';
import ActionCardGrid from '@site/src/components/ActionCardGrid';
import { buildGridData } from './GridData/BuildGridData';
import { HomepagePillItem } from '../../Components/HomepageStartItemCadence/HomepagePillItem';
import { fundGridData } from './GridData/FundGridData';
import { growGridData } from './GridData/GrowGridData';
import { learnGridData } from './GridData/LearnGridData';

export type HomePageProps = SocialLinksSignupProps & {
  concepts?: TutorialCardProps[];
  contentNavigationListItems: ContentNavigationListProps;
  upcomingEvents: UpcomingEventsProps;
};

const HomePage = ({ discordUrl, githubUrl }: HomePageProps): JSX.Element => {
  return (
    <PageBackground gradient="home">
      <LandingHeaderHome
        title="What do you want to do today?"
      />

      <ActionCardGrid title={buildGridData.title} id={buildGridData.title} sections={buildGridData.sections} />
      <ActionCardGrid title={growGridData.title} id={growGridData.title} sections={growGridData.sections} />
      <ActionCardGrid title={fundGridData.title} id={fundGridData.title} sections={fundGridData.sections} />
      <ActionCardGrid title={learnGridData.title} id={learnGridData.title} sections={learnGridData.sections} />
    </PageBackground>
  );
};

export default HomePage;
