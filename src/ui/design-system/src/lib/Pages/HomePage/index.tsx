import React from 'react';
import PageBackground from '../shared/PageBackground';
import { buildGridData } from './GridData/BuildGridData';
import ToolsSection from './ToolsSection';
import GrowSection from './GrowSection';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import BrowseByCategory from './BrowseByCategory';
import QuickStartShowcase from './QuickStartShowcase';

export type HomePageProps = {};

const HomePage = ({}: HomePageProps): JSX.Element => {
  return (
    <PageBackground gradient="home">
      <>
        {/* Hero Section */}
        <HeroSection />

        {/* Feature Sections */}
        <FeatureSection sections={buildGridData.sections} />

        {/* QuickStart Showcase */}
        <QuickStartShowcase />

        <ToolsSection />

        <GrowSection />

        {/* Browse By Category (Docs, Community, Network, More) */}
        <BrowseByCategory />
      </>
    </PageBackground>
  );
};

export default HomePage;
