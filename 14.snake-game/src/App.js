/*
 * https://frontendeval.com/questions/snake
 *
 * Create an HTML/CSS/JS version of Snake
 */

import { useState, useEffect } from "react";
import {
  DIR,
  GAME_SPEED,
  INITIAL_APPLE,
  INITIAL_SNAKE,
  SIZE
} from "./constants";
import {
  getCellStyle,
  getHasLost,
  getNewApple,
  getNewSnakeHead
} from "./helpers";

const App = () => {
  // states
  const [state, setState] = useState({
    snake: INITIAL_SNAKE,
    apple: INITIAL_APPLE,
    dir: DIR.RIGHT,
    isPaused: true
  });
  const { snake, apple, isPaused } = state;

  // derived states
  const score = snake.length - INITIAL_SNAKE.length;
  const hasLost = getHasLost(snake);

  // effects
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    // Game loop
    // TODO: Replace with requestAnimationFrame?
    const intervalId = setInterval(() => {
      setState((prevState) => {
        // state from outer scope is not up to date, it was the value during 1st render
        // need to use the callback form of set state
        const { snake, apple, dir, isPaused } = prevState;
        if (getHasLost(snake) || isPaused) return prevState;
        const newSnake = snake.slice();
        const newHead = getNewSnakeHead(snake, dir);
        newSnake.push(newHead);
        let newApple = [...apple];
        if (newHead[0] === apple[0] && newHead[1] === apple[1]) {
          newApple = getNewApple(newSnake);
        } else {
          newSnake.splice(0, 1);
        }
        return {
          ...prevState,
          snake: newSnake,
          apple: newApple
        };
      });
    }, GAME_SPEED);

    // cleanups
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);
    };
  }, []);

  // handlers
  const handleKeyDown = (evt) => {
    switch (evt.code) {
      case "ArrowDown": {
        setState((prev) => ({ ...prev, dir: DIR.DOWN }));
        break;
      }
      case "ArrowUp": {
        setState((prev) => ({ ...prev, dir: DIR.UP }));
        break;
      }
      case "ArrowLeft": {
        setState((prev) => ({ ...prev, dir: DIR.LEFT }));
        break;
      }
      case "ArrowRight": {
        setState((prev) => ({ ...prev, dir: DIR.RIGHT }));
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleRestart = () => {
    setState({
      snake: INITIAL_SNAKE,
      apple: INITIAL_APPLE,
      dir: DIR.RIGHT,
      isPaused: false
    });
  };

  return (
    <div className="app">
      <h1>
        Score: {score} {hasLost ? "You lost" : ""}
      </h1>
      <div className="grid">
        {console.log({ ...state, score, hasLost })}
        {Array.from({ length: SIZE }).map((_, rowIndex) => (
          <div className="row">
            {Array.from({ length: SIZE }).map((_, colIndex) => (
              <div
                className="cell"
                style={getCellStyle({ rowIndex, colIndex, snake, apple })}
              ></div>
            ))}
          </div>
        ))}
      </div>
      {hasLost && <button onClick={handleRestart}>Restart</button>}
      {!hasLost && !isPaused && (
        <button
          onClick={() => setState((prev) => ({ ...prev, isPaused: true }))}
        >
          Pause
        </button>
      )}
      {!hasLost && isPaused && (
        <button
          onClick={() => setState((prev) => ({ ...prev, isPaused: false }))}
        >
          Start
        </button>
      )}
    </div>
  );
};

export default App;
