import { cn } from '../utils';

describe('cn utility function', () => {
  it('combines class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'hidden');
    expect(result).toBe('base conditional');
  });

  it('handles undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toBe('base valid');
  });

  it('handles empty strings', () => {
    const result = cn('base', '', 'valid');
    expect(result).toBe('base valid');
  });

  it('merges conflicting Tailwind classes', () => {
    // This assumes clsx and tailwind-merge are working correctly
    const result = cn('p-4', 'p-2');
    // tailwind-merge should keep only the last padding class
    expect(result).toBe('p-2');
  });

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles objects with boolean values', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true
    });
    expect(result).toBe('class1 class3');
  });

  it('combines all input types', () => {
    const result = cn(
      'base',
      ['array1', 'array2'],
      {
        'object1': true,
        'object2': false
      },
      undefined,
      'final'
    );
    expect(result).toBe('base array1 array2 object1 final');
  });

  it('handles complex Tailwind class merging', () => {
    const result = cn(
      'bg-red-500 text-white p-4',
      'bg-blue-500 m-2',
      'p-6'
    );
    // Should merge background colors and padding
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('p-6');
    expect(result).toContain('text-white');
    expect(result).toContain('m-2');
  });
});
