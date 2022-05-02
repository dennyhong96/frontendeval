import { Fragment, useEffect, useRef, useState } from "react";

import { useRefState } from "./hooks/useRefState";
import { FIELDS } from "./constants";
import * as helpers from "./helpers";

const initialForm = FIELDS.reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {});

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds, secondsRef] = useRefState(0);

  // refs
  const timeoutIdRef = useRef(null);

  // effects
  useEffect(() => {
    if (!started || paused) return;
    const run = () => {
      timeoutIdRef.current = setTimeout(() => {
        if (secondsRef.current === 0) {
          handleReset();
          alert("Timer has ended.");
          return;
        }
        setSeconds(secondsRef.current - 1);
        run();
      }, 1000);
    };
    run();
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
    // eslint-disable-next-line
  }, [started, paused, secondsRef, setSeconds]);

  // handlers
  const handleChange = (name) => (evt) => {
    const value = evt.target.value;
    if (
      value.length > 2 ||
      !isFinite(Number(evt.target.value)) ||
      Number(value) > FIELDS.find((f) => f.name === name).max
    ) {
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStart = () => {
    // Number("") === 0
    const seconds =
      Number(form.hours) * 60 * 60 +
      Number(form.minutes) * 60 +
      Number(form.seconds);
    setSeconds(seconds);
    setStarted(true);
    setForm(initialForm);
  };

  const togglePause = () => {
    setPaused((prev) => !prev);
  };

  function handleReset() {
    setForm(initialForm);
    setSeconds(0);
    setStarted(false);
  }

  return (
    <div className="app">
      {/* {console.log({
        form,
        started,
        paused,
        seconds,
        secondsRef: secondsRef.current
      })} */}
      {started ? (
        <div className="display">
          {FIELDS.map((field, i) => (
            <Fragment key={field.name}>
              <div>{helpers.getTimeDisplay(field.name, seconds)}</div>
              {i < FIELDS.length - 1 && <span>:</span>}
            </Fragment>
          ))}
          <button onClick={togglePause}>{paused ? `Start` : `Pause`}</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      ) : (
        <div className="inputs">
          {FIELDS.map((field) => (
            <Fragment key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange(field.name)}
              />
            </Fragment>
          ))}
          <button onClick={handleStart}>Start</button>
        </div>
      )}
    </div>
  );
}
