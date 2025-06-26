import { renderHook, act } from '@testing-library/react';
import { useModal } from '../use-modal';

describe('useModal', () => {
  it('initializes with no active modal', () => {
    const { result } = renderHook(() => useModal());
    
    expect(result.current.activeModal).toBeNull();
  });

  it('opens a modal', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.openModal('website');
    });
    
    expect(result.current.activeModal).toBe('website');
  });

  it('closes the modal', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.openModal('website');
    });
    
    expect(result.current.activeModal).toBe('website');
    
    act(() => {
      result.current.closeModal();
    });
    
    expect(result.current.activeModal).toBeNull();
  });

  it('switches between different modals', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.openModal('website');
    });
    
    expect(result.current.activeModal).toBe('website');
    
    act(() => {
      result.current.openModal('automation');
    });
    
    expect(result.current.activeModal).toBe('automation');
  });

  it('handles multiple open/close operations', () => {
    const { result } = renderHook(() => useModal());
    
    // Open modal
    act(() => {
      result.current.openModal('website');
    });
    expect(result.current.activeModal).toBe('website');
    
    // Close modal
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.activeModal).toBeNull();
    
    // Open different modal
    act(() => {
      result.current.openModal('digitalization');
    });
    expect(result.current.activeModal).toBe('digitalization');
    
    // Close again
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.activeModal).toBeNull();
  });
});
