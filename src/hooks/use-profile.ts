import useSWR from 'swr';
import { getProfile } from '../utils/gold-star';

const KEY = (address: string) => ['profile', address];

/**
 * Hook to get the GoldStar profile for the current user
 * @param address The address of the user
 */
export function useProfile(address?: string | null) {
  const {
    data: profile,
    error,
    mutate,
  } = useSWR(address && KEY(address), ([, address]) => getProfile(address));

  console.log({ profile, error });

  return {
    profile,
    isLoading: !profile && !error,
    error,
    mutate,
  };
}
