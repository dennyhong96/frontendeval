import { useCallback, useReducer, useRef } from "react";
import { useSafeDispatch } from "./useSafeDispath";

const STATUS = {
  Idle: "idle",
  Pending: "pending",
  Fulfilled: "fulfilled",
  Rejected: "rejected"
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

export function useAsync(initialConfig) {
  //states
  const [state, unsafeDispatch] = useReducer(reducer, {
    status: STATUS.Idle,
    data: null,
    error: null,
    ...initialConfig
  });
  //handle updating state after component unmounted
  const dispatch = useSafeDispatch(unsafeDispatch);

  //refs
  //handle previous promises resovle/reject after current promise
  const promiseRef = useRef(null);

  //callbacks
  const run = useCallback(
    (promise) => {
      if (!promise) return;
      promiseRef.current = promise;
      dispatch({ status: STATUS.Pending, data: null, error: null });
      promise
        .then((res) => {
          if (promiseRef.current !== promise) return;
          dispatch({ status: STATUS.Fulfilled, data: res, error: null });
        })
        .catch((err) => {
          if (promiseRef.current !== promise) return;
          dispatch({ status: STATUS.Rejected, data: null, error: err });
        });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({
      status: STATUS.Idle,
      data: null,
      error: null,
      ...initialConfig
    });
  }, [dispatch, initialConfig]);

  return {
    ...state,
    run,
    reset
  };
}
