import { type ContentNavigationListProps } from '../../ui/design-system/src/lib/Components/ContentNavigationList';
import { type HomepageStartItemProps } from '../../ui/design-system/src/lib/Components/HomepageStartItem';

const homepageStartProjectData: HomepageStartItemProps[] = [
  {
    title: 'Start Here',
    text: 'Dive into key concepts and learn what makes Flow unique.',
    link: '/next/concepts/start-here',
    icon: 'learn',
  },
  {
    title: 'Guides & Tutorials',
    text: 'Create your first Flow dApp in just a few minutes',
    link: '/next/guides',
    icon: 'quickstart',
  },
  {
    title: 'Resources',
    text: 'All the developer resources you need to build on Flow',
    link: '/next/community-resources',
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
      link: '/next/tools',
      icon: 'tools',
    },
  ],
};

export { homepageStartProjectData, contentNavigationListItems };
