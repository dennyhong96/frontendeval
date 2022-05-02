import { useState } from "react";

import Form from "./components/Form";

export default function App() {
  const [code, setCode] = useState("");

  return (
    <div className="app">
      <Form
        // autoFocus
        codeLength={6}
        initialCode="13"
        // code={code}
        // onChange={setCode}
        onSubmit={alert}
      />
    </div>
  );
}
