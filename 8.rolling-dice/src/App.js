import { useRef, useState } from "react";
import { Dice } from "./components/Dice";
import * as helpers from "./helpers";

/*
 * https://frontendeval.com/questions/rolling-dice
 *
 * Create a dice roller application that can roll anywhere from 1-99 six-sided dice
 */

export default function App() {
  const [dices, setDices] = useState([]);
  const inputRef = useRef(null);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const value = inputRef.current.value;
    if (!isFinite(Number(value)) || Number(value) < 1 || Number(value) > 99) {
      return;
    }
    const newDices = Array.from({ length: Number(value) }).map(() =>
      helpers.getRandomNum(6)
    );
    setDices(newDices);
    inputRef.current.value = "";
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <label>
          <span>Number of dice</span>
          <input ref={inputRef} type="number" min="1" max="99" />
        </label>
        <button>Roll</button>
      </form>
      {dices.length > 0 && (
        <section className="dices">
          {dices.map((d, i) => (
            <Dice key={i} number={d} />
          ))}
        </section>
      )}
    </div>
  );
}
