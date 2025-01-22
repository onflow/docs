import useSWR from 'swr/immutable';
import { User } from '../types/github';
import { useLocalStorage } from './use-local-storage';
import { useEffect } from 'react';

const ONE_HOUR = 1000 * 60 * 60;
const CACHE_KEY = 'last-user-chache';

type CacheEntry = {
  timestamp: number;
  username: string;
  user: User;
};

export function useGithubUser(username?: string | null) {
  // Cache the last fetched user to limit the number of requests to the GitHub API
  const [cache, setCache] = useLocalStorage<CacheEntry | null>(CACHE_KEY, null);
  const {
    data: user,
    isLoading,
    error,
  } = useSWR(
    username ? `https://api.github.com/users/${username}` : null,
    async (url) => {
      // Cache hit
      if (
        cache &&
        cache.username === username &&
        Date.now() - cache.timestamp < ONE_HOUR
      ) {
        return cache.user;
      }
      const response = await fetch(url);
      return response.json() as Promise<User>;
    },
    {
      refreshInterval: ONE_HOUR,
    },
  );

  // Update the cache when the user changes
  useEffect(() => {
    if (user && username && (!cache || cache.username !== username)) {
      setCache({ timestamp: Date.now(), username, user });
    }
  }, [user, username, setCache, cache]);

  return {
    user,
    isLoading,
    error,
  };
}
