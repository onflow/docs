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
    Dive into a rich collection of resources, tutorials, autonomous realms and
    vibrant communities that unlock the full potential of Web3. Whether a
    tinkerer or a seasoned developer, find everything you need to start and
    elevate your projects.
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
        title="Build with Flow"
      />
      <HomepageStartList />

      <PageSections>
        <TransitionPageSection sectionId="explore-more-content">
          <ContentFeatureList />
        </TransitionPageSection>
        <TransitionPageSection sectionId="start-list-cadence">
          <HomepageStartListCadence />
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
