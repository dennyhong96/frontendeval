import { useCallback } from "react";
import { debounce } from "../utils";

export default function useDebounce(wait) {
  // eslint-disable-next-line
  return useCallback(
    debounce((func) => func(), wait),
    []
  );
}
