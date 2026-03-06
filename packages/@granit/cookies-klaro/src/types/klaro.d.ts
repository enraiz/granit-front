declare module 'klaro/dist/klaro-no-css' {
  /**
   * Creates a Klaro consent manager from the given configuration.
   * Returns an object with `getConsent(name)` and `watch(watcher)` methods.
   */
  export function getManager(config: unknown): unknown;
}
