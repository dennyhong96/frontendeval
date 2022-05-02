import { useEffect, useState } from "react";
import useSafeDispatch from "./useSafeDispath";

export default function useDebouncedValue(value, wait) {
  const [debouncedValue, unsafeSetDebouncedValue] = useState(value);
  const setDebouncedValue = useSafeDispatch(unsafeSetDebouncedValue);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, wait);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, wait, setDebouncedValue]);
  return debouncedValue;
}
