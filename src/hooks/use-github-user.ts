import useSWR from 'swr/immutable';
import { User } from '../types/github';

const ONE_HOUR = 1000 * 60 * 60;

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
      refreshInterval: ONE_HOUR,
    },
  );

  return {
    user,
    isLoading,
    error,
  };
}
