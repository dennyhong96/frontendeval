import { useEffect, useRef } from "react";

export default function usePrevValue(value) {
  const prevValueRef = useRef();

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  return prevValueRef.current;
}
