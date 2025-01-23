import { User } from '../types/github';
import { usePersistentCache } from './use-persistent-cache';
import { useEffect, useState } from 'react';

const ONE_HOUR = 1000 * 60 * 60;
const CACHE_KEY = 'avatar-cache';

export function useGithubAvatar(username?: string | null) {
  // Cache to reduce the number of requests
  const cache = usePersistentCache<string, string>(CACHE_KEY, {
    max: 10,
    ttl: ONE_HOUR,
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) {
      setAvatar(null);
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cachedAvatar = cache.get(username);
        if (cachedAvatar) {
          setAvatar(cachedAvatar);
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.github.com/users/${username}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        const user: User = await response.json();
        setAvatar(user.avatar_url);
        cache.set(username, user.avatar_url);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [username, cache]);

  return {
    avatar,
    isLoading,
    error,
  };
}
