import { describe, it, expect, vi, beforeEach } from "vitest";

import { createKlaroCookieConsentProvider } from "../adapters/create-klaro-cookie-consent-provider.js";

import type { KlaroConsentManager, KlaroConfig, KlaroWatcher } from "../types/index.js";

const mockManager: KlaroConsentManager = {
  getConsent: vi.fn(),
  setConsent: vi.fn(),
  saveAndApplyConsents: vi.fn(),
  confirmed: false,
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
    mockManager.confirmed = false;
  });

  it("should return default consents before init", () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });

    const consents = provider.getConsents();

    expect(consents.strictly_necessary).toBe(true);
    expect(consents.analytics).toBe(false);
    expect(consents.marketing).toBe(false);
  });

  it("should initialize Klaro manager on init()", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });

    await provider.init();

    vi.mocked(mockManager.getConsent).mockReturnValue(false);
    const consents = provider.getConsents();
    expect(consents.strictly_necessary).toBe(true);
  });

  it("should return true for category when all services consented", async () => {
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

  it("should return false for category when one service not consented (all-or-nothing)", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });
    await provider.init();

    vi.mocked(mockManager.getConsent).mockImplementation((name: string) => {
      return name === "google-analytics";
    });

    const consents = provider.getConsents();

    expect(consents.analytics).toBe(false);
  });

  it("should always keep strictly_necessary true", async () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });
    await provider.init();

    vi.mocked(mockManager.getConsent).mockReturnValue(false);
    const consents = provider.getConsents();

    expect(consents.strictly_necessary).toBe(true);
  });

  it("should watch the manager and call back on change via onConsentChange", async () => {
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

  it("should replace update with no-op on onConsentChange cleanup", async () => {
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

    vi.mocked(mockManager.getConsent).mockReturnValue(true);
    capturedWatcher?.update({}, "consents", {});

    expect(callback).not.toHaveBeenCalled();
  });

  it("should return no-op from onConsentChange when manager not initialized", () => {
    const provider = createKlaroCookieConsentProvider({
      klaroConfig,
      serviceMappings,
    });

    const callback = vi.fn();
    const unsubscribe = provider.onConsentChange(callback);

    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
  });

  describe("setConsent", () => {
    it("should set consent for all services in a category and persist", async () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });
      await provider.init();

      provider.setConsent("analytics", true);

      expect(mockManager.setConsent).toHaveBeenCalledWith("google-analytics", true);
      expect(mockManager.setConsent).toHaveBeenCalledWith("matomo", true);
      expect(mockManager.saveAndApplyConsents).toHaveBeenCalledOnce();
    });

    it("should ignore strictly_necessary category", async () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });
      await provider.init();

      provider.setConsent("strictly_necessary", true);

      expect(mockManager.setConsent).not.toHaveBeenCalled();
      expect(mockManager.saveAndApplyConsents).not.toHaveBeenCalled();
    });

    it("should be a no-op when manager not initialized", () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });

      provider.setConsent("analytics", true);

      expect(mockManager.setConsent).not.toHaveBeenCalled();
    });
  });

  describe("setAllConsents", () => {
    it("should set all non-essential services and persist", async () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });
      await provider.init();

      provider.setAllConsents(true);

      expect(mockManager.setConsent).toHaveBeenCalledWith("google-analytics", true);
      expect(mockManager.setConsent).toHaveBeenCalledWith("matomo", true);
      expect(mockManager.setConsent).toHaveBeenCalledWith("youtube", true);
      expect(mockManager.saveAndApplyConsents).toHaveBeenCalledOnce();
    });

    it("should revoke all non-essential services", async () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });
      await provider.init();

      provider.setAllConsents(false);

      expect(mockManager.setConsent).toHaveBeenCalledWith("google-analytics", false);
      expect(mockManager.setConsent).toHaveBeenCalledWith("matomo", false);
      expect(mockManager.setConsent).toHaveBeenCalledWith("youtube", false);
      expect(mockManager.saveAndApplyConsents).toHaveBeenCalledOnce();
    });

    it("should be a no-op when manager not initialized", () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });

      provider.setAllConsents(true);

      expect(mockManager.setConsent).not.toHaveBeenCalled();
    });
  });

  describe("hasConsented", () => {
    it("should return false when manager not initialized", () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });

      expect(provider.hasConsented()).toBe(false);
    });

    it("should return false when user has not consented yet", async () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });
      await provider.init();

      mockManager.confirmed = false;

      expect(provider.hasConsented()).toBe(false);
    });

    it("should return true when user has already consented", async () => {
      const provider = createKlaroCookieConsentProvider({
        klaroConfig,
        serviceMappings,
      });
      await provider.init();

      mockManager.confirmed = true;

      expect(provider.hasConsented()).toBe(true);
    });
  });
});
