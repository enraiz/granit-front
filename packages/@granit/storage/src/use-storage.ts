import { useCallback, useRef, useSyncExternalStore } from 'react';

import { createStorage } from './create-storage.js';

import type { StorageOptions } from './create-storage.js';

/**
 * React hook that synchronizes component state with localStorage (or sessionStorage).
 *
 * Uses `useSyncExternalStore` for tear-free reads and automatic re-renders
 * when the stored value changes (including cross-tab via the `storage` event).
 *
 * @example
 * ```tsx
 * function Sidebar() {
 *   const [open, setOpen] = useStorage('sidebar-open', false);
 *   return <nav data-open={open}>...</nav>;
 * }
 * ```
 */
export function useStorage<T>(
  key: string,
  defaultValue: T,
  options?: StorageOptions<T>,
): [T, (value: T) => void] {
  const storage = createStorage<T>(key, options);

  // Cache the raw string + parsed value to keep referential stability.
  // useSyncExternalStore requires getSnapshot to return the same reference
  // when the underlying data has not changed.
  const cacheRef = useRef<{ raw: string | null; value: T }>({
    raw: undefined as unknown as string | null,
    value: defaultValue,
  });

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === storage.key) onStoreChange();
      };
      globalThis.addEventListener('storage', handler);
      return () => globalThis.removeEventListener('storage', handler);
    },
    [storage.key],
  );

  const getSnapshot = useCallback((): T => {
    const backend = options?.storage === 'session' ? sessionStorage : localStorage;
    const raw = backend.getItem(storage.key);

    if (raw === cacheRef.current.raw) {
      return cacheRef.current.value;
    }

    const value = storage.get() ?? defaultValue;
    cacheRef.current = { raw, value };
    return value;
  }, [storage, defaultValue, options?.storage]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);

  const setValue = useCallback(
    (next: T) => {
      storage.set(next);
      globalThis.dispatchEvent(
        new StorageEvent('storage', { key: storage.key }),
      );
    },
    [storage],
  );

  return [value, setValue];
}
