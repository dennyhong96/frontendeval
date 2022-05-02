import { useEffect, useRef, useState } from "react";

import useDebounce from "./hooks/useDebounce";
import useAsync from "./hooks/useAsync";
import * as api from "./api";
import * as utils from "./utils";

const searchWithMemo = utils.withMemo(api.search, { cacheTime: 30 * 1000 });

export default function App() {
  // states
  const { data: results, run } = useAsync({ data: [] });
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);

  // callbacks
  const debounce = useDebounce(500);

  // ref
  const promiseRef = useRef(null);
  const resultListRef = useRef(null);
  const inputRef = useRef(null);

  // effects
  useEffect(() => {
    if (query.length < 2) {
      promiseRef.current = null;
      return run([]);
    }
    debounce(() => run(searchWithMemo(query)));
  }, [query, debounce, run]);

  // hanlders
  const handleChange = (evt) => {
    setQuery(evt.target.value);
  };

  const addToList = (itemName) => {
    setList((prev) => [
      ...prev,
      {
        name: itemName,
        id: utils.randomId("item"),
        checked: false
      }
    ]);
  };

  const handleCheck = (itemId) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : { ...item }
      )
    );
  };

  const handleDelete = (itemId) => {
    setList((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCloseResults = (evt) => {
    evt.preventDefault();
    setQuery("");
    inputRef.current.focus();
    return;
  };

  const handleResultNavigation = (evt) => {
    const target = evt.target;
    const resultButtons = [...resultListRef.current.querySelectorAll("button")];
    const index = resultButtons.findIndex((el) => el === target);
    if (index < 0) return;
    if (evt.key === "ArrowUp") {
      evt.preventDefault(); // prevent default scroll behavior
      if (index === 0) {
        resultButtons[resultButtons.length - 1].focus();
      } else {
        resultButtons[index - 1].focus();
      }
    } else if (evt.key === "ArrowDown") {
      evt.preventDefault();
      if (index === resultButtons.length - 1) {
        resultButtons[0].focus();
      } else {
        resultButtons[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (evt) => {
    if (evt.key === "Escape") {
      return handleCloseResults(evt);
    }
    handleResultNavigation(evt);
  };

  return (
    <div className="app">
      <section className="search">
        <div>
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Search..."
          />
          <button aria-label="Clear query" onClick={setQuery.bind(null, "")}>
            x
          </button>
        </div>
        {results.length > 0 && (
          <ul ref={resultListRef} tabIndex={-1} onKeyDown={handleKeyDown}>
            {results.map((result) => (
              <li key={result}>
                <button onClick={addToList.bind(null, result)}>{result}</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {list.length > 0 && (
        <section className="display">
          <ul>
            {list.map((item) => (
              <li className={item.checked ? "checked" : ""} key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    value={item.checked}
                    onChange={handleCheck.bind(null, item.id)}
                  />
                  <span>{item.name}</span>
                </label>
                <button
                  aria-label={`Remove ${item.name}`}
                  onClick={handleDelete.bind(null, item.id)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
