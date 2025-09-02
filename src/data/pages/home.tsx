import { type ContentNavigationListProps } from '../../ui/design-system/src/lib/Components/ContentNavigationList';
import { IconName } from '../../types/icons';

const contentNavigationListItems: ContentNavigationListProps = {
  header: 'Key Features',
  contentNavigationItems: [
    {
      title: 'Why Flow',
      text: 'Introduction to the Network',
      link: '/build/cadence/flow',
      icon: IconName.LEARN,
    },
    {
      title: 'Account Abstraction',
      text: 'Enhance UX with a flexible Account structure and key management',
      link: '/build/cadence/advanced-concepts/account-abstraction',
      icon: IconName.LEARN,
    },
    {
      title: 'Account Linking',
      text: 'Seamless onboarding and secure resource ownership',
      link: '/build/cadence/guides/account-linking',
      icon: IconName.LEARN,
    },
    {
      title: 'Mobile',
      text: 'Build truly mobile first experiences',
      link: '/blockchain-development-tutorials/cadence/mobile',
      icon: IconName.TOOLS,
    },
  ],
};

export { contentNavigationListItems };
