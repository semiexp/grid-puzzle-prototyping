import { useState } from "react";

import { Editor } from "./editor";
import { Player } from "./player";
import { SimplePuzzle } from "./simplePuzzle";

function App() {
  const [mode, setMode] = useState<"edit" | "play">("edit");
  const [puzzle, setPuzzle] = useState(new SimplePuzzle());
  const [generation, setGeneration] = useState(0);

  return (
    <div>
      <div>
        <input type="button" value="Edit" onClick={() => setMode("edit")} />
        <input type="button" value="Play" onClick={() => {
          if (mode === "edit") {
            setMode("play");
            setGeneration(generation ^ 1);
          }
        }} />
      </div>

      <div style={mode === "edit" ? {} : {display: "none"}}>
        <Editor puzzle={puzzle} updatePuzzle={(p) => setPuzzle(p)} />
      </div>
      {mode === "play" ? <Player puzzle={puzzle} /> : null}
    </div>
  );
}

export default App;
