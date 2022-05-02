import { useRef } from "react";

import { debounce } from "../utils";

export default function useDebounce(wait) {
  const { current: run } = useRef(debounce((func) => func(), wait));
  return run;
}
