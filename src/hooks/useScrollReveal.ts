import { useState, useRef, useEffect } from 'react';

interface UseScrollRevealOptions {
  readonly threshold?: number;
  readonly rootMargin?: string;
  readonly triggerOnce?: boolean;
}

interface UseScrollRevealReturn<T extends HTMLElement = HTMLElement> {
  readonly ref: React.RefObject<T | null>;
  readonly isVisible: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(options: UseScrollRevealOptions = {}): UseScrollRevealReturn<T> {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (isVisible) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, isVisible]);

  return { ref, isVisible };
}
