import { useEffect, useState } from 'react';
import { LRUCache } from 'lru-cache';

export function usePersistentCache<K extends {}, V extends {}>(
  key: string,
  opts: LRUCache.Options<K, V, any>,
): LRUCache<K, V> {
  const [cache] = useState(() => {
    const cache = new LRUCache<K, V>(opts);
    if (typeof window === 'undefined') {
      return cache;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        cache.load(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cache from localStorage', e);
    }
    return cache;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const save = () => {
      try {
        localStorage.setItem(key, JSON.stringify(cache.dump()));
      } catch (e) {
        console.error('Failed to save cache to localStorage', e);
      }
    };

    window.addEventListener('beforeunload', save);

    return () => {
      window.removeEventListener('beforeunload', save);
    };
  });

  return cache;
}
