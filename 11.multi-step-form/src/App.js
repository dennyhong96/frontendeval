import { useRef } from "react";

import Form from "./components/Form";
import { fields } from "./constants";

export default function App() {
  const formHandle = useRef(null);

  return (
    <div className="app">
      <Form
        ref={formHandle}
        fields={fields}
        onSubmit={(form) => {
          alert(JSON.stringify(form, null, 2));
          formHandle.current.handleReset();
        }}
        onStepChange={console.log}
        onChange={console.log}
      />
    </div>
  );
}
