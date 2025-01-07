import { SocialType } from '../types/gold-star';
import { ChallengeContract } from '../utils/constants';
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
      label: 'Create handle',
      completed: profile && !!profile.handle,
    },
    {
      label: 'Add Github Profile',
      completed: profile && !!profile.socials[SocialType.GITHUB],
    },
    {
      label: 'Add how you found Flow',
      completed: profile && !!profile.referralSource,
    },
    {
      label: 'Add contract addresses',
      completed: profile && Object.keys(profile.deployedContracts).length > 0,
    },
  ] as ProgressItem[];

  const challengeItems = [
    {
      label: 'Complete first challenge',
      completed:
        profile &&
        profile.submissions?.[ChallengeContract.NOOP_CHALLENGE]?.completed,
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
