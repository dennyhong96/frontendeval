import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";

import styles from "./index.module.css";

const Form = forwardRef(
  (
    {
      code: externalCode,
      onChange,
      codeLength = 4,
      initialCode = "",
      onSubmit,
      autoFocus = false
    },
    ref
  ) => {
    const initCode = initialCode.length > codeLength ? "" : initialCode;
    const isExternalControl = externalCode !== undefined;

    // state
    const [internalCode, setCode] = useLocalStorageState(initCode, "app-code");

    // refs
    const code = isExternalControl ? externalCode : internalCode;
    const inputRefs = useRef([]);
    const appendInputToRef = (idx, el) => {
      inputRefs.current[idx] = el;
    };
    const focusInput = (idx) => inputRefs.current?.[idx]?.focus();

    // imperitive API
    useImperativeHandle(ref, () => ({
      handleReset,
      focusInput
    }));

    // handlers
    const handleChange = (idx, evt) => {
      if (!evt.key.match(/^\d*$/)) return;
      const newCode = code.slice(0, idx) + evt.key;
      if (!isExternalControl) setCode(newCode);
      onChange?.(newCode);
      focusInput(newCode.length);
    };

    const handleDelete = (idx) => {
      const newCode = code.slice(0, idx);
      if (!isExternalControl) setCode(newCode);
      onChange?.(newCode);
      focusInput(idx - 1);
    };

    const handleInput = (idx, evt) => {
      if (evt.key === "Backspace") {
        handleDelete(idx);
      }
      handleChange(idx, evt);
    };

    const handleSubmit = (evt) => {
      evt.preventDefault();
      if (code.length < codeLength) return;
      onSubmit?.(code);
      handleReset();
    };

    const handleReset = () => {
      if (!isExternalControl) setCode(initCode);
      onChange?.(initCode);
      focusInput(initCode.length);
    };

    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <ul>
          {Array(codeLength)
            .fill(null)
            .map((_, i) => (
              <li key={i}>
                <input
                  autoFocus={autoFocus && i === initCode.length}
                  ref={appendInputToRef.bind(null, i)}
                  value={code.slice(i, i + 1)}
                  onKeyDown={handleInput.bind(null, i)}
                />
              </li>
            ))}
        </ul>
        <button type="submit" disabled={code.length < codeLength}>
          Submit
        </button>
      </form>
    );
  }
);

export default Form;
