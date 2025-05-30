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
import { growGridData } from './GridData/GrowGridData';
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

      <ActionCardGrid title={buildGridData.title} id={buildGridData.title} icon={buildGridData.icon} iconColor={buildGridData.iconColor} sections={buildGridData.sections} />
      <ActionCardGrid title={growGridData.title} id={growGridData.title} icon={growGridData.icon} iconColor={growGridData.iconColor} sections={growGridData.sections} />

    </PageBackground>
  );
};

export default HomePage;
