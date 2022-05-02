import { useCallback, useEffect } from "react";

import useLocalStorageState from "./hooks/useLocalStorageState";
import * as api from "./api";
import * as helpers from "./helpers";
import { isJson } from "./utils";

/*
interface IGuessChar {
  char: string;
  match: boolean;
  includes: boolean;
}
type IGuess = IGuessChar[];
*/

export default function App() {
  // states
  const [word, setWord] = useLocalStorageState("", "wordle-word");
  const [input, setInput] = useLocalStorageState("", "wordle-input");
  const [guesses, setGuesses] = /* <IGuess[]> */ useLocalStorageState(
    [],
    "wordle-guesses"
  );

  // derived states
  const guessesLeft = 6 - guesses.length;
  const hasWon = helpers.getHasWon(guesses, word);
  const hasLost = guessesLeft <= 0 && !hasWon;

  const resetGame = useCallback(() => {
    setInput("");
    setGuesses([]);
  }, [setInput, setGuesses]);

  const getWord = useCallback(async () => {
    const prevWordJson = localStorage.getItem("wordle-word");
    if (!prevWordJson || !isJson(prevWordJson)) resetGame();
    const prevWord = JSON.parse(prevWordJson);
    const newWord = await api.getWord();
    if (newWord !== prevWord) resetGame();
    setWord(newWord);
  }, [setWord, resetGame]);

  // effects
  useEffect(() => {
    getWord();
  }, [getWord]);

  // handlers
  const handleInput = (evt) => {
    const value = evt.target.value.toLowerCase();
    if (hasWon || hasLost || value.length > 5 || !value.match(/^[a-z]*$/)) {
      return;
    }
    setInput(value);
  };

  const hanleSubmit = async (evt) => {
    evt.preventDefault();
    if (
      hasWon ||
      hasLost ||
      input.length !== 5 ||
      !(await api.validate(input))
    ) {
      return;
    }
    const guess = helpers.createGuess(input, word);
    setGuesses((prev) => [...prev, guess]);
    setInput("");
  };

  return (
    <div className="app">
      <h4>
        {hasWon
          ? `You correctly guessed the word in ${guesses.length} tries!`
          : hasLost
          ? `You lost, the word was "${word.toUpperCase()}"`
          : `You have ${guessesLeft} guesses left`}
      </h4>
      <form onSubmit={hanleSubmit}>
        <input
          disabled={hasWon || hasLost}
          type="text"
          maxLength={5}
          value={input.toUpperCase()}
          onChange={handleInput}
        />
      </form>
      <ul>
        {guesses.map((guess, idx) => (
          <li key={idx}>
            {guess.map(({ char, match, includes }, i) => (
              <span
                className={match ? "green" : includes ? "yellow" : ""}
                key={`${char}-${i}`}
              >
                {char.toUpperCase()}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
