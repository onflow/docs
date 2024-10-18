import React from 'react';
import {
  LandingHeaderHome,
  HomepageStartList,
  HomepageStartListCadence,
} from '../../Components';
import { type ContentNavigationListProps } from '../../Components/ContentNavigationList';
import { type SocialLinksSignupProps } from '../../Components/SocialLinksSignup';
import { type TutorialCardProps } from '../../Components/TutorialCard';
import { type UpcomingEventsProps } from '../../Components/UpcomingEvents';
import PageBackground from '../shared/PageBackground';
import PageSection from '../shared/PageSection';
import PageSections from '../shared/PageSections';
import { ContentFeatureList } from '../../Components/ContentFeatureList';
import { PageCarousel } from '../../Components/PageCarousel';
import { LinkGrid } from '../../Components/LinkGrid';
import { SocialCards } from '../../Components/SocialCards';
import BgImage from '../../../../images/misc/bg-social-section.jpg';
import TransitionPageSection from '../shared/TransitionPageSection';
import { SignUpSection } from '../../Components/HomepageStartList/SignUpSection';

export type HomePageProps = SocialLinksSignupProps & {
  concepts?: TutorialCardProps[];
  contentNavigationListItems: ContentNavigationListProps;
  upcomingEvents: UpcomingEventsProps;
};

const Description = (): JSX.Element => (
  <>
    Flow is a fast, decentralized platform for apps, games, and digital assets. Build and grow your projects on a scalable, secure network. Whether you're learning Cadence or using EVM compatibility, Flow empowers your innovative ideas.
  </>
);

const HomePage = ({ discordUrl, githubUrl }: HomePageProps): JSX.Element => {
  return (
    <PageBackground gradient="home">
      <LandingHeaderHome
        description={<Description />}
        discordUrl={discordUrl}
        githubUrl={githubUrl}
        tag="onflow"
        title="Build On Flow"
      />
      <ContentFeatureList />

      <PageSections>
        <TransitionPageSection sectionId="explore-more-content">
          <HomepageStartListCadence />
        </TransitionPageSection>
        <TransitionPageSection sectionId="start-list-cadence">
          <HomepageStartList />
        </TransitionPageSection>
        <TransitionPageSection
          className={'md:mx-4'}
          sectionId="start-building-onflow"
        >
          <PageCarousel />
        </TransitionPageSection>
        <TransitionPageSection
          className={'md:mx-4'}
          sectionId="explore-the-docs"
        >
          <LinkGrid />
        </TransitionPageSection>
        <TransitionPageSection sectionId="newsletter">
          <PageSection>
            <SignUpSection />
          </PageSection>
        </TransitionPageSection>
        <div className="" style={{ backgroundImage: `url(${BgImage})` }}>
          <TransitionPageSection sectionId="get-involved">
            <SocialCards />
          </TransitionPageSection>
        </div>
      </PageSections>
    </PageBackground>
  );
};

export default HomePage;
