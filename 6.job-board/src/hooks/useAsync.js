import { useCallback, useReducer, useRef } from "react";
import { useSafeDispatch } from "./useSafeDispatch";

const initialData = {
  status: "idle",
  data: null,
  error: null
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

export default function useAsync(config) {
  // state
  const [state, unsafeDispatch] = useReducer(reducer, {
    ...initialData,
    ...config
  });
  const dispatch = useSafeDispatch(unsafeDispatch);

  // refs
  const promiseRef = useRef(null);

  // callbacks
  const run = useCallback(
    (promise) => {
      if (!promise) return;
      dispatch({ status: "pending" });
      promiseRef.current = promise;
      promise
        .then((res) => {
          if (promise !== promiseRef.current) return;
          dispatch({
            status: "fulfilled",
            data: res,
            error: null
          });
        })
        .catch((err) => {
          if (promise !== promiseRef.current) return;
          dispatch({
            status: "rejected",
            data: null,
            error: err
          });
        });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ ...initialData, ...config });
  }, [config, dispatch]);

  return {
    ...state,
    run,
    reset
  };
}
