import React from 'react';
import Layout from '@theme/Layout';

import ToolsPage from '../ui/design-system/src/lib/Pages/ToolsPage';

import { data } from '../data/pages/tools';
import { getMetaTitle } from '../utils/seo.server';

export default function Tools(): JSX.Element {
  return (
    <Layout title={getMetaTitle('Tools')}>
      <main>
        <ToolsPage
          apisAndServices={data.apisAndServices}
          contentNavigationListItems={data.contentNavigationListItems}
          discordUrl={data.discordUrl}
          editPageUrl={data.editPageUrl}
          explorers={data.explorers}
          githubUrl={data.githubUrl}
          sdks={data.sdks}
          secondaryNavSections={data.secondaryNavSections}
          tools={data.tools}
          wallets={data.wallets}
        />
      </main>
    </Layout>
  );
}
