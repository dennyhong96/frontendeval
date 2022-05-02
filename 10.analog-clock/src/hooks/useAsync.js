import { useCallback, useRef, useState } from "react";
import useSafeDispatch from "./useSafeDispath";

const DEFAULT_CONFIG = {
  status: "idle",
  data: null,
  error: null
};

export default function useAsync(initialConfig) {
  // state
  const [state, unsafeSetState] = useState({
    ...DEFAULT_CONFIG,
    ...initialConfig
  });
  const setState = useSafeDispatch(unsafeSetState);
  const initialData = initialConfig.data ?? null;

  // track the latest pending promise
  const promiseRef = useRef(null);

  // run
  const run = useCallback(
    (promise) => {
      if (!promise) return;
      promiseRef.current = promise;
      setState({
        status: "pending",
        data: initialData,
        error: null
      });
      promise
        .then((data) => {
          // handle earlier promise resolved later than later promises
          if (promiseRef.current !== promise) return;
          setState({
            status: "fulfilled",
            data,
            error: null
          });
        })
        .catch((error) => {
          if (promiseRef.current !== promise) return;
          setState({
            status: "rejected",
            data: initialData,
            error
          });
        });
    },
    [setState, initialData]
  );

  const reset = useCallback(
    () =>
      setState({
        ...DEFAULT_CONFIG,
        ...initialConfig
      }),
    [setState, initialConfig]
  );

  return {
    ...state,
    run,
    reset
  };
}
