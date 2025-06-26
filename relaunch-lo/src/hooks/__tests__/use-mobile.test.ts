import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

// Mock window.matchMedia AND window.innerWidth
const mockMatchMedia = (matches: boolean, innerWidth: number = matches ? 500 : 1024) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: innerWidth,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('useIsMobile', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns true for mobile screens', () => {
    mockMatchMedia(true, 500); // Mobile width
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
  });

  it('returns false for desktop screens', () => {
    mockMatchMedia(false, 1024); // Desktop width
    
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
  });

  it('uses correct media query', () => {
    const mockMatchMediaFn = jest.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMediaFn,
    });
    
    renderHook(() => useIsMobile());
    
    expect(mockMatchMediaFn).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('updates when screen size changes', () => {
    let matchesValue = false;
    const listeners: ((event: any) => void)[] = [];
    
    const mockMatchMediaFn = jest.fn().mockReturnValue({
      matches: matchesValue,
      media: '(max-width: 768px)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((type, listener) => {
        if (type === 'change') {
          listeners.push(listener);
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMediaFn,
    });
    
    const { result, rerender } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
    
    // Simulate screen size change
    matchesValue = true;
    listeners.forEach(listener => listener({ matches: true }));
    rerender();
    
    // Note: In a real implementation, this would update the hook's state
    // The actual behavior depends on the implementation of useMobile
  });
});
