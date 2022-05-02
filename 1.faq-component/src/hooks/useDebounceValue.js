import { useEffect, useState } from "react";

export default function useDebounceValue(value, wait) {
  const [debouncedValue, setDebbouncedValue] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebbouncedValue(value);
    }, wait);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, wait]);
  return debouncedValue;
}
