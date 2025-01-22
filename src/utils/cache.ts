const CACHE_KEY = 'app-cache';

/**
 * Local storage cache
 * @returns The cache map
 */
export function localStorageCache(): Map<string, any> {
  function readCache() {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
  }

  function writeCache(data: any) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  }

  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map<string, any>(readCache());

  function updateCache() {
    // Merge the existing cache with the new cache.
    const currentCache = readCache();
    const updatedCache = new Map(readCache());
    let hasChanged = false;
    map.forEach((value, key) => {
      if (currentCache[key] !== value) {
        hasChanged = true;
        updatedCache.set(key, value);
      }
    });

    writeCache(updatedCache);
  }

  // Update the cache periodically.
  setInterval(updateCache, 2500);

  // We still use the map for write & read for performance.
  return map;
}
