
const cache = new Map<string, { value: unknown; expiresAt: number }>();

export const getCacheValue = <T = unknown>(
  key: string,
): T | undefined => {
  const entry = cache.get(key);

  if (!entry) {
    return undefined;
  }

  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }

  return entry.value as T;
};

export const setCacheValue = (
  key: string,
  value: unknown,
  ttl: number,
): void => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
};

export const deleteCacheValue = (key: string): void => {
  cache.delete(key);
};
