import { useState } from "react";
import * as utils from "./utils";
import * as helpers from "./helpers";

/*
 * https://frontendeval.com/questions/connect-four
 *
 * Create a 2-player game of Connect Four
 *
 * window.connectFour.checkForWinner(board): checks for a winner and returns null/'draw', or the winning game token.
 * `board` must be a 2D array of `null` for empty spaces, and primitive values for game tokens (e.g. numbers/strings: 1 or 2, 'red' or 'yellow', 'player 1' or 'player 2')
 *
 * window.connectFour.deepClone(array/object): makes a deep copy of an array or object (e.g. a 2D array)
 */

const BOARD_ROWS_COUNT = 6;
const BOARD_COLS_COUNT = 7;
const RED = "red";
const YELLOW = "yellow";
const INITIAL_STATE = Array.from({ length: BOARD_ROWS_COUNT }).map(() =>
  Array.from({ length: BOARD_COLS_COUNT }).map(() => null)
);

// Getters
const getPlayer = (board) =>
  board.flat().filter((c) => c !== null).length % 2 === 0 ? RED : YELLOW;

const getDraw = (board, winner) =>
  !winner && board.flat().every((cell) => cell !== null);

// Helpers
const getPlacement = (board, placementCol) => {
  let placementRow = null;
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row][placementCol] === null) {
      placementRow = row;
      break;
    }
  }
  if (placementRow === null) return null; // column is full
  return [placementRow, placementCol];
};

export default function App() {
  // states
  const [board, setBoard] = useState(INITIAL_STATE);

  // derived states
  const player = getPlayer(board);
  const winner = helpers.checkForWinner(board);
  const hasDraw = getDraw(board, winner);

  // handlers
  const handleDrop = (placementCol) => {
    if (winner || hasDraw) return;
    const placement = getPlacement(board, placementCol);
    if (!placement) return; // column is full
    const [row, col] = placement;
    const newBoard = utils.deepClone(board);
    newBoard[row][col] = player;
    setBoard(newBoard);
  };

  const handleRestart = () => {
    setBoard(INITIAL_STATE);
  };

  return (
    <div className="app">
      {console.log({ board, player, winner })}
      <h1>
        {hasDraw ? `Draw` : winner ? `${winner} won` : `${player}'s turn`}
      </h1>
      {winner || hasDraw ? (
        <button onClick={handleRestart}>Play again</button>
      ) : (
        <div className="drops">
          {Array.from({ length: BOARD_COLS_COUNT }).map((_, i) => (
            <button onClick={handleDrop.bind(null, i)}>Drop</button>
          ))}
        </div>
      )}
      <div className="board">
        {board.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`}>
            {row.map((cell, colIdx) => (
              <div key={`cell-${colIdx}`}>
                {cell !== null && <div className={cell} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
