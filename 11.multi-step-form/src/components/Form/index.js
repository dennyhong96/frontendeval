import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { getInitialState, validate } from "../../helpers";

import styles from "./index.module.css";

const Form = forwardRef(({ fields, onSubmit, onChange, onStepChange }, ref) => {
  // states
  const [form, setForm] = useState(getInitialState(fields));
  const [step, setStep] = useState(0);

  // derived states
  const field = fields[step];
  const value = form[field.name];
  const isFirstStep = step === 0;
  const isLastStep = step === fields.length - 1;

  // refs
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current?.focus();

  // Imperative API
  useImperativeHandle(ref, () => ({
    handleReset,
    focusInput,
    setStep
  }));

  // effects
  useEffect(() => {
    focusInput();
    onStepChange?.(step, form);
  }, [step]);

  useEffect(() => {
    onChange?.(form);
    // eslint-disable-next-line
  }, [form]);

  // handlers
  function handleReset() {
    setStep(0);
    setForm(getInitialState(fields));
  }

  const handleChange = (name, evt) => {
    setForm((prev) => ({ ...prev, [name]: evt.target.value }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const validator = field.validate ?? validate;
    if (!validator(value)) return;
    if (!isLastStep) {
      setStep((prev) => prev + 1);
      return;
    }
    onSubmit?.(form);
  };

  const handleBack = () => {
    if (isFirstStep) return;
    setStep((prev) => prev - 1);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {!isFirstStep && (
        <button className={styles.back} type="button" onClick={handleBack}>
          Back
        </button>
      )}
      <label>
        <span>{field.label}</span>
        <input
          ref={inputRef}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={handleChange.bind(null, field.name)}
        />
      </label>
      <button type="submit">{isLastStep ? "Submit" : "Next"}</button>
    </form>
  );
});

export default Form;
