import { useEffect, useRef } from "react";

export default function usePrevValue(value) {
  // refs
  const prevValueRef = useRef(value);

  // effects
  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  return prevValueRef.current;
}
