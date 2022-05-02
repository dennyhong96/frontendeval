import { useEffect, useRef, useState } from "react";

import useSafeDispatch from "./useSafeDispath";
import { isJson } from "../utils";

export default function useLocalStorageState(initialState, key) {
  const [state, unsafeSetState] = useState(getInitialState(initialState));
  const setState = useSafeDispatch(unsafeSetState);
  function getInitialState(initialState) {
    const json = localStorage.getItem(key);
    if (!json || !isJson(json)) {
      return typeof initialState === "function" ? initialState() : initialState;
    }
    return JSON.parse(json);
  }

  const prevKeyRef = useRef(key);

  useEffect(() => {
    if (prevKeyRef.current !== key) {
      localStorage.removeItem(prevKeyRef.current);
    }
    localStorage.setItem(key, JSON.stringify(state));
    prevKeyRef.current = key;
  }, [state, key]);

  return [state, setState];
}
