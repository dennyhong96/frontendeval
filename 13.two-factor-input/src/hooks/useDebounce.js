import { useCallback, useRef } from "react";
import { debounce } from "../utils";

export function useDebounce(wait) {
  // eslint-disable-next-line
  return useCallback(
    debounce((func) => func(), wait),
    []
  );
}

// export function useDebounce(wait) {
//   return useRef(debounce((func) => func(), wait)).current;
// }
