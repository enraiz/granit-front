// Key prefix to avoid collisions with third-party libraries.
const KEY_PREFIX = 'dd:';

export interface StorageOptions<T> {
  /** Custom serializer (default: JSON.stringify). */
  serialize?: (value: T) => string;
  /** Custom deserializer (default: JSON.parse). */
  deserialize?: (raw: string) => T;
  /** Storage backend (default: 'local'). */
  storage?: 'local' | 'session';
}

export interface TypedStorage<T> {
  /** Read the stored value, or null if absent / unparseable. */
  get(): T | null;
  /** Write a value to storage. */
  set(value: T): void;
  /** Remove the key from storage. */
  remove(): void;
  /** The prefixed key used in the underlying storage backend. */
  readonly key: string;
}

function getBackend(type: 'local' | 'session'): Storage {
  return type === 'session' ? sessionStorage : localStorage;
}

/**
 * Create a typed storage accessor with an automatic `dd:` key prefix.
 *
 * @example
 * ```typescript
 * const themeStorage = createStorage<'light' | 'dark'>('theme');
 * themeStorage.set('dark');    // writes to localStorage key "dd:theme"
 * themeStorage.get();          // returns 'dark'
 * ```
 */
export function createStorage<T>(
  key: string,
  options?: StorageOptions<T>,
): TypedStorage<T> {
  const prefixedKey = `${KEY_PREFIX}${key}`;
  const backend = getBackend(options?.storage ?? 'local');
  const serialize = options?.serialize ?? JSON.stringify;
  const deserialize = options?.deserialize ?? (JSON.parse as (raw: string) => T);

  return {
    key: prefixedKey,

    get(): T | null {
      try {
        const raw = backend.getItem(prefixedKey);
        if (raw === null) return null;
        return deserialize(raw);
      } catch {
        return null;
      }
    },

    set(value: T): void {
      backend.setItem(prefixedKey, serialize(value));
    },

    remove(): void {
      backend.removeItem(prefixedKey);
    },
  };
}
