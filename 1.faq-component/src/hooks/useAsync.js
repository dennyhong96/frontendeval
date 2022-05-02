import { useCallback, useMemo, useReducer, useRef } from "react";

import useSafeDispatch from "./useSafeDispath";

const STATUS = {
  Idle: "idle",
  Pending: "pending",
  Fulfilled: "fulfilled",
  Rejected: "rejected"
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

export default function useAsync({
  data: initialData = null,
  error: initialError = null,
  status: inisitalStatus = STATUS.Idle
} = {}) {
  const initialConfig = useMemo(
    () => ({
      status: inisitalStatus,
      data: initialData,
      error: initialError
    }),
    []
  );
  console.log("rerender");

  //states
  const [state, unsafeDispatch] = useReducer(reducer, initialConfig);
  //handle updating state after component unmounted
  const dispatch = useSafeDispatch(unsafeDispatch);

  //refs
  //handle previous promises resovle/reject after current promise
  const promiseRef = useRef(null);

  //callbacks
  const run = useCallback(
    (promise) => {
      if (!promise) return;
      if (!(promise instanceof Promise)) {
        if (typeof promise === "function") {
          promise = promise(); // handle async function
        } else {
          promise = Promise.resolve(promise); // handle primitives
        }
      }
      promiseRef.current = promise;
      dispatch({
        ...initialConfig,
        status: STATUS.Pending
      });
      promise
        .then((res) => {
          if (promiseRef.current !== promise) return;
          dispatch({
            ...initialConfig,
            status: STATUS.Fulfilled,
            data: res
          });
        })
        .catch((err) => {
          if (promiseRef.current !== promise) return;
          dispatch({ ...initialConfig, status: STATUS.Rejected, error: err });
        });
    },
    [dispatch, initialConfig]
  );

  const reset = useCallback(() => {
    dispatch(initialConfig);
  }, [dispatch, initialConfig]);

  return {
    ...state,
    run,
    reset
  };
}
