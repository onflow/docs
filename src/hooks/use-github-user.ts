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
  );

  return {
    user,
    isLoading,
    error,
  };
}
