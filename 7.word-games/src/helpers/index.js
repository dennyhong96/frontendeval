export function createGuess(input, word) /* IGuess */ {
  let map = new Map();
  word.split("").forEach((char) => map.set(char, (map.get(char) ?? 0) + 1));
  const guess = input.split("").map((char, i) => {
    const guessChar = {
      char,
      match: false,
      includes: false
    };
    if (map.has(char) && map.get(char) > 0 && char === word[i]) {
      guessChar.match = true;
      guessChar.includes = true;
      map.set(char, map.get(char) - 1);
    } else if (map.has(char) && map.get(char) > 0) {
      guessChar.includes = true;
      map.set(char, map.get(char) - 1);
    }
    return guessChar;
  });
  map.clear();
  map = undefined;
  return guess;
}

/*
interface IGuessChar {
  char: string;
  match: boolean;
  includes: boolean;
}
type IGuess = IGuessChar[];
*/

export function getHasWon(guesses, word) {
  return guesses.some(
    (guess) => guess.map(({ char }) => char).join("") === word
  );
}
