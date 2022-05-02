import { DIR, SIZE } from "../constants";

export const getNewApple = (snake) => {
  const getRandomIndex = () => Math.floor(Math.random() * SIZE);
  let appleRow = snake[0][0];
  let appleCol = snake[0][1];
  do {
    appleRow = getRandomIndex();
    appleCol = getRandomIndex();
  } while (
    snake.some((cell) => cell[0] === appleRow) &&
    snake.some((cell) => cell[1] === appleCol)
  );
  return [appleRow, appleCol];
};

export const getNewSnakeHead = (snake, dir) => {
  const head = snake[snake.length - 1];
  let nextHead;
  switch (dir) {
    case DIR.RIGHT: {
      nextHead = [head[0], head[1] + 1];
      break;
    }
    case DIR.LEFT: {
      nextHead = [head[0], head[1] - 1];
      break;
    }
    case DIR.DOWN: {
      nextHead = [head[0] + 1, head[1]];
      break;
    }
    case DIR.UP: {
      nextHead = [head[0] - 1, head[1]];
      break;
    }
    default: {
      break;
    }
  }
  return nextHead;
};

export const getCellStyle = ({ rowIndex, colIndex, snake, apple }) => {
  if (snake.some((pos) => pos[0] === rowIndex && pos[1] === colIndex)) {
    return { background: "#000" };
  } else if (apple[0] === rowIndex && apple[1] === colIndex) {
    return { background: "red" };
  }
  return {};
};

export const getHasLost = (snake) => {
  const head = snake[snake.length - 1];
  const outOfBounds =
    head[0] > SIZE - 1 || head[0] < 0 || head[1] > SIZE - 1 || head[1] < 0;
  const overlaps = snake.some((pos, i) =>
    snake.some(
      (pos2, i2) => i2 !== i && pos[0] === pos2[0] && pos[1] === pos2[1]
    )
  );
  return outOfBounds || overlaps;
};
