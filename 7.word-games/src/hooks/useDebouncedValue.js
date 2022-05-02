import { useEffect, useState } from "react";
import useSafeDispatch from "./useSafeDispath";

export default function useDebouncedValue(value, wait) {
  // states
  const [debouncedValue, unsafeSetDebouncedValue] = useState(value);
  const setDebouncedValue = useSafeDispatch(unsafeSetDebouncedValue);

  // effects
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, wait);
    return () => {
      // cancel timeout when value or wait changes, or unmounts
      clearTimeout(timeoutId);
    };
  }, [value, wait, setDebouncedValue]);

  return debouncedValue;
}
