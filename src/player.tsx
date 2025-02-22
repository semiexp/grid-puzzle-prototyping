import { useEffect, useState } from "react";

import { Puzzle } from "./puzzle";

export type PlayerProps<T, P extends Puzzle<T>> = {
  puzzle: P;
};

export const Player = <T, P extends Puzzle<T>>(props: PlayerProps<T, P>) => {
  const [puzzle, setPuzzle] = useState(props.puzzle.asPlayMode());
  const [history, setHistory] = useState<P[]>([]);

  // add key event listener
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "r") {
      setPuzzle(props.puzzle.asPlayMode());
      setHistory([]);
      return;
    }

    if (event.key === "z") {
      if (history.length > 0) {
        setPuzzle(history[history.length - 1]);
        setHistory(history.slice(0, -1));
      }
      return;
    }

    let nextPuzzle = null;
    switch (event.key) {
      case "ArrowUp":
      case "w":
        nextPuzzle = puzzle.move("up");
        break;
      case "ArrowDown":
      case "s":
        nextPuzzle = puzzle.move("down");
        break;
      case "ArrowLeft":
      case "a":
        nextPuzzle = puzzle.move("left");
        break;
      case "ArrowRight":
      case "d":
        nextPuzzle = puzzle.move("right");
        break;
    }
    if (nextPuzzle !== null) {
      setPuzzle(nextPuzzle);
      setHistory([...history, puzzle]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [puzzle]);

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
