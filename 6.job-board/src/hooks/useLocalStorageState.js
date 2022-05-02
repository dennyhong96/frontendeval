import { useEffect, useRef, useState } from "react";

export default function useLocalStorageState(
  initialState,
  key,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  // state
  const [state, setState] = useState(getInitialState);

  // lazy state initializer
  function getInitialState() {
    const json = localStorage.getItem(key);
    if (json) return deserialize(json);
    // initialState could be a lazy initializer function
    return typeof initialState === "function" ? initialState() : initialState;
  }

  const keyRef = useRef(key);

  // effect
  useEffect(() => {
    if (key !== keyRef.current) localStorage.removeItem(keyRef.current);
    localStorage.setItem(key, serialize(state));
    keyRef.current = key;
  }, [state, key, serialize]);

  return [state, setState];
}
