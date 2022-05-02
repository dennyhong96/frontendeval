import { useEffect, useState } from "react";

import useSafeDispatch from "./useSafeDispath";

export default function useDebounceValue(value, wait) {
  // state
  const [debouncedValue, unsafeSetDebouncedValue] = useState(value);
  const setDebouncedValue = useSafeDispatch(unsafeSetDebouncedValue);

  // effects
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Update debounced value after delay
      setDebouncedValue(value);
    }, wait);
    return () => {
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed
      // within the delay period. Timeout gets cleared and restarted.
      clearTimeout(timeoutId);
    };
  }, [value, wait, setDebouncedValue]);

  return debouncedValue;
}
