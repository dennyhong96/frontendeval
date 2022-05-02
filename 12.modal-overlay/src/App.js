import { useRef, useState } from "react";
import Modal from "./components/Modal";

export default function App() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  return (
    <div className="app">
      {/* <button ref={ref} onClick={setOpen.bind(null, !open)}>
        button
      </button> */}
      <Modal
        // open={open}
        // initialOpen
        trigger={<button>button</button>}
        // returnFocusRef={ref}
        // onOpen={setOpen.bind(null, true)}
        // onClose={setOpen.bind(null, false)}
      >
        <h1>test test</h1>
        <input />
        <a href="/">test</a>
        <button>test</button>
      </Modal>
    </div>
  );
}
