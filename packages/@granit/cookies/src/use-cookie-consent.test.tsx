import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { CookieConsentProvider } from "./CookieConsentContext.tsx";
import { useCookieConsent } from "./use-cookie-consent.ts";

import type { CookieConsentProvider as ICookieConsentProvider, ConsentState } from "./types.ts";
import type { ReactNode } from "react";

function createMockProvider(
  consents: Partial<ConsentState> = {}
): ICookieConsentProvider {
  const state: ConsentState = {
    strictly_necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
    ...consents,
  };

  return {
    init: vi.fn().mockResolvedValue(undefined),
    getConsents: vi.fn().mockReturnValue(state),
    onConsentChange: vi.fn().mockReturnValue(() => {}),
  };
}

function createWrapper(provider: ICookieConsentProvider) {
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <CookieConsentProvider provider={provider}>
        {children}
      </CookieConsentProvider>
    );
  };
}

describe("useCookieConsent", () => {
  it("should throw when used outside CookieConsentProvider", () => {
    expect(() => renderHook(() => useCookieConsent())).toThrow(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  });

  it("should return default consents before initialization", () => {
    const provider = createMockProvider();

    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: createWrapper(provider),
    });

    expect(result.current.consents.strictly_necessary).toBe(true);
    expect(result.current.consents.analytics).toBe(false);
    expect(result.current.isLoaded).toBe(false);
  });

  it("should call provider.init on mount", () => {
    const provider = createMockProvider();

    renderHook(() => useCookieConsent(), {
      wrapper: createWrapper(provider),
    });

    expect(provider.init).toHaveBeenCalledOnce();
  });

  it("should load consents after initialization", async () => {
    const provider = createMockProvider({ analytics: true });

    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: createWrapper(provider),
    });

    await vi.waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.consents.analytics).toBe(true);
    expect(provider.getConsents).toHaveBeenCalled();
    expect(provider.onConsentChange).toHaveBeenCalled();
  });

  it("should update consent state on acceptCategory", async () => {
    const provider = createMockProvider();

    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: createWrapper(provider),
    });

    await vi.waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.acceptCategory("analytics");
    });

    expect(result.current.consents.analytics).toBe(true);
  });

  it("should update consent state on revokeCategory", async () => {
    const provider = createMockProvider({ preferences: true });

    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: createWrapper(provider),
    });

    await vi.waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.revokeCategory("preferences");
    });

    expect(result.current.consents.preferences).toBe(false);
  });

  it("should ignore strictly_necessary on revokeCategory", async () => {
    const provider = createMockProvider();

    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: createWrapper(provider),
    });

    await vi.waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.revokeCategory("strictly_necessary");
    });

    expect(result.current.consents.strictly_necessary).toBe(true);
  });

  it("should grant all categories on acceptAll", async () => {
    const provider = createMockProvider();

    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: createWrapper(provider),
    });

    await vi.waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.acceptAll();
    });

    expect(result.current.consents).toEqual({
      strictly_necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    });
  });

  it("should revoke non-essential categories on revokeAll", async () => {
    const provider = createMockProvider({
      preferences: true,
      analytics: true,
      marketing: true,
    });

    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: createWrapper(provider),
    });

    await vi.waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.revokeAll();
    });

    expect(result.current.consents).toEqual({
      strictly_necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    });
  });
});
