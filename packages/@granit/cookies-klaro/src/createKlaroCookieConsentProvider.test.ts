import { describe, it, expect, vi, beforeEach } from "vitest";

import { createKlaroCookieConsentProvider } from "./createKlaroCookieConsentProvider.ts";

import type { KlaroConsentManager, KlaroConfig, KlaroWatcher } from "./types.ts";

// Mock the dynamic import of klaro
const mockManager: KlaroConsentManager = {
  getConsent: vi.fn(),
  watch: vi.fn(),
};

vi.mock("klaro/dist/klaro-no-css", () => ({
  getManager: () => mockManager,
}));

const klaroConfig: KlaroConfig = {
  services: [
    { name: "google-analytics", purposes: ["analytics"] },
    { name: "matomo", purposes: ["analytics"] },
    { name: "youtube", purposes: ["marketing"] },
  ],
};

const serviceMappings = [
  { name: "google-analytics", category: "analytics" as const },
  { name: "matomo", category: "analytics" as const },
  { name: "youtube", category: "marketing" as const },
];

describe("createKlaroCookieConsentProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns default consents before init", () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });

    const consents = provider.getConsents();

    expect(consents.strictly_necessary).toBe(true);
    expect(consents.analytics).toBe(false);
    expect(consents.marketing).toBe(false);
  });

  it("initializes Klaro manager on init()", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });

    await provider.init();

    // After init, getConsents should use the manager
    vi.mocked(mockManager.getConsent).mockReturnValue(false);
    const consents = provider.getConsents();
    expect(consents.strictly_necessary).toBe(true);
  });

  it("returns true for category when all services consented", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });
    await provider.init();

    vi.mocked(mockManager.getConsent).mockImplementation((name: string) => {
      return name === "google-analytics" || name === "matomo";
    });

    const consents = provider.getConsents();

    expect(consents.analytics).toBe(true);
    expect(consents.marketing).toBe(false);
  });

  it("returns false for category when one service not consented (all-or-nothing)", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });
    await provider.init();

    vi.mocked(mockManager.getConsent).mockImplementation((name: string) => {
      // Only google-analytics consented, matomo not
      return name === "google-analytics";
    });

    const consents = provider.getConsents();

    expect(consents.analytics).toBe(false);
  });

  it("strictly_necessary is always true", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });
    await provider.init();

    vi.mocked(mockManager.getConsent).mockReturnValue(false);
    const consents = provider.getConsents();

    expect(consents.strictly_necessary).toBe(true);
  });

  it("onConsentChange watches the manager and calls back on change", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });
    await provider.init();

    let capturedWatcher: KlaroWatcher | undefined;
    vi.mocked(mockManager.watch).mockImplementation((watcher: KlaroWatcher) => {
      capturedWatcher = watcher;
    });

    const callback = vi.fn();
    provider.onConsentChange(callback);

    expect(mockManager.watch).toHaveBeenCalledOnce();

    // Simulate a consent change
    vi.mocked(mockManager.getConsent).mockReturnValue(true);
    capturedWatcher?.update({}, "consents", {});

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        strictly_necessary: true,
        analytics: true,
        marketing: true,
      })
    );
  });

  it("onConsentChange cleanup replaces update with no-op", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });
    await provider.init();

    let capturedWatcher: KlaroWatcher | undefined;
    vi.mocked(mockManager.watch).mockImplementation((watcher: KlaroWatcher) => {
      capturedWatcher = watcher;
    });

    const callback = vi.fn();
    const unsubscribe = provider.onConsentChange(callback);

    unsubscribe();

    // After cleanup, calling update should be a no-op
    vi.mocked(mockManager.getConsent).mockReturnValue(true);
    capturedWatcher?.update({}, "consents", {});

    expect(callback).not.toHaveBeenCalled();
  });

  it("onConsentChange returns no-op when manager not initialized", () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });

    const callback = vi.fn();
    const unsubscribe = provider.onConsentChange(callback);

    expect(typeof unsubscribe).toBe("function");
    // Should not throw
    unsubscribe();
  });
});
