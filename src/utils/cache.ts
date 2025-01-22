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

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    // Merge the existing cache with the new cache.
    const updatedCache = readCache();
    map.forEach((value, key) => {
      updatedCache.set(key, value);
    });
    writeCache(updatedCache);
  });

  // We still use the map for write & read for performance.
  return map;
}
