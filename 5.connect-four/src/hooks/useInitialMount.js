import { useLayoutEffect, useRef } from "react";

export function useInitialMount() {
  const isInitialMountRef = useRef(true);

  useLayoutEffect(() => {
    isInitialMountRef.current = false;
  }, []);

  return isInitialMountRef.current;
}
