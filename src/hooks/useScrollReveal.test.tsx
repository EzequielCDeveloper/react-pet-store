import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useScrollReveal } from './useScrollReveal';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let observerCallback: ObserverCallback | null = null;
let observeMock: ReturnType<typeof vi.fn>;
let unobserveMock: ReturnType<typeof vi.fn>;
let disconnectMock: ReturnType<typeof vi.fn>;

class MockIntersectionObserver {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;

  constructor(callback: ObserverCallback) {
    observerCallback = callback;
    this.observe = observeMock;
    this.unobserve = unobserveMock;
    this.disconnect = disconnectMock;
  }
}

function TestComponent({
  triggerOnce,
  onRender,
}: {
  readonly triggerOnce?: boolean;
  readonly onRender: (data: { isVisible: boolean }) => void;
}) {
  const { ref, isVisible } = useScrollReveal({ triggerOnce, threshold: 0.1 });
  onRender({ isVisible });
  return <div ref={ref}>test</div>;
}

describe('useScrollReveal', () => {
  beforeEach(() => {
    observerCallback = null;
    observeMock = vi.fn();
    unobserveMock = vi.fn();
    disconnectMock = vi.fn();

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      })),
    );
  });

  it('returns isVisible initially false', () => {
    let captured: { isVisible: boolean } | null = null;

    render(
      <TestComponent
        onRender={(data) => {
          captured = data;
        }}
      />,
    );

    expect(captured?.isVisible).toBe(false);
  });

  it('isVisible becomes true when intersecting', () => {
    let captured: { isVisible: boolean } | null = null;

    render(
      <TestComponent
        triggerOnce={false}
        onRender={(data) => {
          captured = data;
        }}
      />,
    );

    act(() => {
      observerCallback?.([{ isIntersecting: true }]);
    });

    expect(captured?.isVisible).toBe(true);
  });

  it('isVisible stays true with triggerOnce (does not toggle back)', () => {
    let captured: { isVisible: boolean } | null = null;

    render(
      <TestComponent
        triggerOnce={true}
        onRender={(data) => {
          captured = data;
        }}
      />,
    );

    act(() => {
      observerCallback?.([{ isIntersecting: true }]);
    });

    expect(captured?.isVisible).toBe(true);

    act(() => {
      observerCallback?.([{ isIntersecting: false }]);
    });

    expect(captured?.isVisible).toBe(true);
  });

  it('with triggerOnce=false, isVisible toggles back to false', () => {
    let captured: { isVisible: boolean } | null = null;

    render(
      <TestComponent
        triggerOnce={false}
        onRender={(data) => {
          captured = data;
        }}
      />,
    );

    act(() => {
      observerCallback?.([{ isIntersecting: true }]);
    });

    expect(captured?.isVisible).toBe(true);

    act(() => {
      observerCallback?.([{ isIntersecting: false }]);
    });

    expect(captured?.isVisible).toBe(false);
  });

  it('respects prefers-reduced-motion (isVisible starts true)', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      })),
    );

    let captured: { isVisible: boolean } | null = null;

    render(
      <TestComponent
        onRender={(data) => {
          captured = data;
        }}
      />,
    );

    expect(captured?.isVisible).toBe(true);
  });
});
