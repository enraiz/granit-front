import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Radix UI primitives (Tooltip, Popover) use ResizeObserver which is not available in jsdom.
vi.stubGlobal(
  'ResizeObserver',
  class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  },
);

// Radix Select uses scrollIntoView which is not available in jsdom.
Element.prototype.scrollIntoView = vi.fn();

// Sonner (toast) uses window.matchMedia for dark mode detection.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
