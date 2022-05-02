import { useCallback } from "react";

import { debounce } from "../utils";

export function useDebounce(wait) {
  // eslint-disable-next-line
  return useCallback(
    debounce((fn) => fn(), wait),
    []
  );
}
