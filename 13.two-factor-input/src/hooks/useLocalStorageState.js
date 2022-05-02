import { useEffect, useRef, useState } from "react";
import { useSafeDispatch } from "./useSafeDispath";

const isJson = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

export function useLocalStorageState(initialState, key) {
  //states
  const [state, unsafeSetState] = useState(() => getInitialState(initialState));
  const setState = useSafeDispatch(unsafeSetState);
  function getInitialState(initialState) {
    const json = localStorage.getItem(key);
    if (!json || !isJson(json)) {
      return typeof initialState === "function" ? initialState() : initialState;
    }
    return JSON.parse(json);
  }

  //refs
  const prevKeyRef = useRef(key);

  //effects
  useEffect(() => {
    if (prevKeyRef.current !== key) {
      localStorage.removeItem(prevKeyRef.current);
    }
    localStorage.setItem(key, JSON.stringify(state));
    prevKeyRef.current = key;
  }, [state, key]);

  return [state, setState];
}
