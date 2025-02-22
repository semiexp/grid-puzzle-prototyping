import { useEffect, useState } from "react";

import { Puzzle } from "./puzzle";

export type PlayerProps<T, P extends Puzzle<T>> = {
  puzzle: P;
};

export const Player = <T, P extends Puzzle<T>>(props: PlayerProps<T, P>) => {
  const [puzzle, setPuzzle] = useState(props.puzzle.asPlayMode());

  // add key event listener
  const onKeyDown = (event: KeyboardEvent) => {
    setPuzzle((puzzle) => {
      let nextPuzzle = null;
      switch (event.key) {
        case "ArrowUp":
          nextPuzzle = puzzle.move("up");
          break;
        case "ArrowDown":
          nextPuzzle = puzzle.move("down");
          break;
        case "ArrowLeft":
          nextPuzzle = puzzle.move("left");
          break;
        case "ArrowRight":
          nextPuzzle = puzzle.move("right");
          break;
      }

      if (nextPuzzle === null) {
        return puzzle;
      } else {
        return nextPuzzle;
      }
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const unitSize = 40;
  const [renderHeight, renderWidth] = puzzle.renderSize(unitSize);

  return (
    <div>
      <svg width={renderWidth} height={renderHeight}>
        {puzzle.render(unitSize)}
      </svg>
    </div>
  );
};
