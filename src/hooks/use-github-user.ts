import useSWR from 'swr/immutable';
import { User } from '../types/github';
import { localStorageCache } from '../utils/cache';

export function useGithubUser(username?: string | null) {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR(
    username ? `https://api.github.com/users/${username}` : null,
    async (url) => {
      const response = await fetch(url);
      return response.json() as Promise<User>;
    },
    {
      provider: () => localStorageCache(),
    },
  );

  return {
    user,
    isLoading,
    error,
  };
}
