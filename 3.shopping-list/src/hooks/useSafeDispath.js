import { useCallback, useEffect, useRef } from "react";

export default function useSafeDisptach(unsafeDispatch) {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return useCallback(
    (...args) => {
      if (!mountedRef.current) return;
      unsafeDispatch(...args);
    },
    [unsafeDispatch]
  );
}
