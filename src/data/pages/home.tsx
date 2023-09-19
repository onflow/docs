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
  header: 'Explore Key Concepts and Features',
  contentNavigationItems: [
    {
      title: 'Why Flow',
      text: 'All the resources you need to learn and build',
      link: '/build/flow',
      icon: 'learn',
    },
    {
      title: 'Account Abstraction',
      text: 'Flow blockchain Account structure, key management',
      link: '/build/advanced-concepts/account-abstraction',
      icon: 'learn',
    },
    {
      title: 'Account Linking',
      text: 'Seamless onboarding and secure resources ownership sharing',
      link: '/build/advanced-concepts/account-linking',
      icon: 'learn',
    },
    {
      title: 'Mobile',
      text: 'Develop on Flow for mobile platforms',
      link: '/build/mobile/overview',
      icon: 'tools',
    },
  ],
};

export { homepageStartProjectData, contentNavigationListItems };
