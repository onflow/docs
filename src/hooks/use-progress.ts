import { SocialType } from '../types/gold-star';
import { GOLD_STAR_CHALLENGES } from '../utils/constants';
import { getChallengeIdentifier } from '../utils/flow';
import { useCurrentUser } from './use-current-user';
import { useProfile } from './use-profile';

export interface ProgressItem {
  label: string;
  completed: boolean;
}

export function useProgress() {
  const { user } = useCurrentUser();
  const { profile } = useProfile(user.addr);

  const profileItems = [
    {
      label: 'Create your handle',
      completed: profile && !!profile.handle,
    },
    {
      label: 'Link your Github profile',
      completed: profile && !!profile.socials[SocialType.GITHUB],
    },
    {
      label: 'Share how you discovered Flow',
      completed: profile && !!profile.referralSource,
    },
    {
      label: 'Add your contract addresses',
      completed:
        profile &&
        (Object.keys(profile.deployedContracts.cadenceContracts).length > 0 ||
          Object.keys(profile.deployedContracts.evmContracts).length > 0),
    },
  ] as ProgressItem[];

  const challengeItems = [
    {
      label: 'Complete your first challenge',
      completed:
        profile &&
        profile.submissions?.[
          getChallengeIdentifier(GOLD_STAR_CHALLENGES.LEARN_FLOW_CHALLENGE)
        ]?.completed,
    },
  ] as ProgressItem[];

  function getProgress() {
    const items = [...profileItems, ...challengeItems];
    const total = items.length;
    const completed = items.filter((item) => item.completed).length;
    return completed / total;
  }

  return {
    profileItems,
    challengeItems,
    getProgress,
  };
}
