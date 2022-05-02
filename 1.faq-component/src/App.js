import { useState } from "react";

import Accordion from "./components/Accordion";
import { ITEMS } from "./constants";

export default function App() {
  const [openIndex, setOpenIndex] = useState(-1);

  const handleChange = (newOpenIndex) => {
    setOpenIndex((prev) => (prev === newOpenIndex ? -1 : newOpenIndex));
  };

  return (
    <div className="app">
      <Accordion
      // openIndex={openIndex}
      // onChange={handleChange}
      >
        {ITEMS.map((item, idx) => (
          <Accordion.Item
            key={item.question}
            initialOpen={idx === 0}
            header={item.question}
          >
            {item.answer}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
