import { type ContentNavigationListProps } from '../../ui/design-system/src/lib/Components/ContentNavigationList';
import { type HomepageStartItemProps } from '../../ui/design-system/src/lib/Components/HomepageStartItem';

const homepageStartProjectData: HomepageStartItemProps[] = [
  {
    title: 'Getting Started',
    text: 'Dive into key concepts and learn what makes Flow unique.',
    link: '/getting-started/hello-world',
    icon: 'learn',
  },
  {
    title: 'Developer Guides',
    text: 'Create your first Flow dApp in just a few minutes',
    link: '/guides/flow-app-quickstart',
    icon: 'quickstart',
  },
  {
    title: 'Tools & Resources',
    text: 'All the developer tools you need to build on Flow',
    link: '/tools/flow-cli',
    icon: 'documentation',
  },
];

const contentNavigationListItems: ContentNavigationListProps = {
  header: 'Explore More Content',
  contentNavigationItems: [
    {
      title: 'Learn',
      text: 'All the resources you need to learn and build.',
      link: 'https://academy.ecdao.org/en',
      icon: 'learn',
    },
    {
      title: 'Tools',
      text: 'Curated list of developer tools, services, SDKs.',
      link: '/tools',
      icon: 'tools',
    },
  ],
};

export { homepageStartProjectData, contentNavigationListItems };
