import { useLayoutEffect, useRef, useState } from "react";

export function useRefState(initialState) {
  // states
  const [state, setState] = useState(initialState);

  // refs
  const stateRef = useRef(null);

  // runs before useEffect
  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  return [state, setState, stateRef];
}
