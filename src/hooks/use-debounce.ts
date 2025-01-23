import { useEffect, useState } from 'react';

export function useDebounce<T = any>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return {
    value: debouncedValue,
    isDebouncing: debouncedValue !== value,
  };
}
