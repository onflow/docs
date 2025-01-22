import useSWR from 'swr/immutable';
import { User } from '../types/github';

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
      refreshInterval: 1000 * 60 * 60, // 1 hour
    },
  );

  return {
    user,
    isLoading,
    error,
  };
}
