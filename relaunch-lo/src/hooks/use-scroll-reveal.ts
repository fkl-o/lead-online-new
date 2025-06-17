import { useEffect, useRef } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  delay?: number;
}

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const { threshold = 0.1, delay = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
          }
        });
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay]);

  return ref;
};
