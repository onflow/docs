import React from 'react';
import {
  HomeNav,
} from '../../Components/HomeNav';
import { type ContentNavigationListProps } from '../../Components/ContentNavigationList';
import { type SocialLinksSignupProps } from '../../Components/SocialLinksSignup';
import { type TutorialCardProps } from '../../Components/TutorialCard';
import { type UpcomingEventsProps } from '../../Components/UpcomingEvents';
import PageBackground from '../shared/PageBackground';
import ActionCardGrid from '@site/src/components/ActionCardGrid';
import { buildGridData } from './GridData/BuildGridData';
import { fundGridData } from './GridData/FundGridData';
import { growGridData } from './GridData/GrowGridData';
import { learnGridData } from './GridData/LearnGridData';
import { HomeHeader } from '../../Components/HomeHeader';

export type HomePageProps = SocialLinksSignupProps & {
  concepts?: TutorialCardProps[];
  contentNavigationListItems: ContentNavigationListProps;
  upcomingEvents: UpcomingEventsProps;
};

const HomePage = ({ discordUrl, githubUrl }: HomePageProps): JSX.Element => {
  return (
    <PageBackground gradient="home">
      <HomeHeader />
      <HomeNav
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
