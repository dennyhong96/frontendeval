import { useCallback, useEffect, useRef, useState } from "react";

import useDebounce from "./hooks/useDebounce";
import useSafeDispatch from "./hooks/useSafeDispath";
import * as api from "./api";
import * as helpers from "./helpers";
import { CURRENCIES } from "./constants";
import useDebouncedValue from "./hooks/useDebouncedValue";

export default function App() {
  // states
  const [amount, setAmount] = useState(0);
  const debouncedAmount = useDebouncedValue(amount, 500);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [value, unsafeSetValue] = useState(0);
  const setValue = useSafeDispatch(unsafeSetValue);

  // refs
  const prevValueRef = useRef(0);
  const debounce = useDebounce(500);
  const intervalIdRef = useRef(null);

  // derived states
  const wucAmount = amount / value;
  const prevWucAmount = amount / prevValueRef.current;
  const diff = wucAmount - prevWucAmount;

  const fetchAndRefreshValue = useCallback(async () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    const run = async () => {
      const newValue = await api.convert(currency);
      setValue(newValue);
    };
    run();
    intervalIdRef.current = setInterval(run, 10 * 1000);
  }, [currency, setValue]);

  // effect
  useEffect(() => {
    // debounce(fetchAndRefreshValue);
    fetchAndRefreshValue();
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [currency, debouncedAmount, debounce, fetchAndRefreshValue]);

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  console.log({
    amount,
    debouncedAmount,
    currency,
    value,
    wucAmount,
    prevWucAmount,
    diff,
    prevValueRef: prevValueRef.current
  });

  // handlers
  const handleChange = (evt) => {
    const value = Number(evt.target.value);
    if (!isFinite(value)) return;
    setAmount(value);
  };

  return (
    <div className="app">
      <div className="inputs">
        <input type="number" value={amount} onChange={handleChange} />
        <select onChange={(evt) => setCurrency(evt.target.value.toLowerCase())}>
          {CURRENCIES.map((cur) => (
            <option key={cur}>{cur.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div className="display">
        <span>{helpers.displayCurrency(wucAmount)}</span>
        <span>WUC</span>
        <div className={diff > 0 ? "green" : diff < 0 ? "red" : ""}>
          {diff > 0 ? (
            <span>&#8593;</span>
          ) : diff < 0 ? (
            <span>&#8595;</span>
          ) : (
            ""
          )}
          <span> {helpers.displayCurrency(diff)}</span>
        </div>
      </div>
    </div>
  );
}
