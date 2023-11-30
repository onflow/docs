import { type ContentNavigationListProps } from '../../ui/design-system/src/lib/Components/ContentNavigationList';
import { type HomepageStartItemProps } from '../../ui/design-system/src/lib/Components/HomepageStartItem';

const homepageStartProjectData: HomepageStartItemProps[] = [
  {
    title: 'Getting Started',
    text: 'Dive into key concepts with a Hello World quickstart',
    link: '/build/getting-started/quickstarts/hello-world',
    icon: 'learn',
  },
  {
    title: 'Developer Guides',
    text: 'Create your first dApp in just a few minutes',
    link: '/build/guides/flow-app-quickstart',
    icon: 'quickstart',
  },
  {
    title: 'Resources',
    text: 'All the developer tools you need',
    link: '/tools/flow-cli',
    icon: 'documentation',
  },
];

const contentNavigationListItems: ContentNavigationListProps = {
  header: 'Explore Key Concepts and Features',
  contentNavigationItems: [
    {
      title: 'Why Flow',
      text: 'Introduction to the Network',
      link: '/build/flow',
      icon: 'learn',
    },
    {
      title: 'Account Abstraction',
      text: 'Enhance UX with a flexible Account structure and key management',
      link: '/build/advanced-concepts/account-abstraction',
      icon: 'learn',
    },
    {
      title: 'Account Linking',
      text: 'Seamless onboarding and secure resource ownership',
      link: '/build/advanced-concepts/account-linking',
      icon: 'learn',
    },
    {
      title: 'Mobile',
      text: 'Build truly mobile first experiences',
      link: '/build/guides/mobile/overview',
      icon: 'tools',
    },
  ],
};

export { homepageStartProjectData, contentNavigationListItems };
