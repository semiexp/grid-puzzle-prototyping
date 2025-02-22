import { JSX } from "react";

export type Move = "up" | "down" | "left" | "right";

export abstract class Puzzle<T> {
  // Editor methods
  abstract gridSize(): [number, number];
  abstract numLayers(): number;
  abstract getEditableItems(layer: number): T[];
  abstract getCell(y: number, x: number, layer: number): T;
  abstract setCell(y: number, x: number, layer: number, value: T): this | null;

  // Player methods
  abstract asPlayMode(): this;
  abstract move(move: Move): this | null;

  // Rendering methods

  // Render the contents of a cell at a given position and layer.
  // Return a SVG element rendered to [0, cellSize] x [0, cellSize],
  // or null if there is nothing to render for this cell and layer. 
  abstract renderItem(item: T, cellSize: number): JSX.Element | null;

  renderSize(cellSize: number): [number, number] {
    const [gridHeight, gridWidth] = this.gridSize();
    const margin = 10;
    return [gridHeight * cellSize + margin * 2, gridWidth * cellSize + margin * 2];
  }

  mouseToCell(y: number, x: number, cellSize: number): [number, number] | null {
    const margin = 10;
    const [gridHeight, gridWidth] = this.gridSize();
    const cellX = Math.floor((x - margin) / cellSize);
    const cellY = Math.floor((y - margin) / cellSize);

    if (!(0 <= cellX && cellX < gridWidth && 0 <= cellY && cellY < gridHeight)) {
      return null;
    }

    return [cellY, cellX];
  }

  render(cellSize: number): JSX.Element {
    const [height, width] = this.gridSize();
    const numLayers = this.numLayers();

    const margin = 10;

    const items = [];
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const cellItems = [];
        cellItems.push(<rect key="background" x={0} y={0} width={cellSize} height={cellSize} stroke="#cccccc" fill="none" strokeWidth={1} />);
        for (let layer = 0; layer < numLayers; ++layer) {
          const item = this.renderItem(this.getCell(y, x, layer), cellSize);
          if (item) {
            cellItems.push(
              <g key={`${y}-${x}-${layer}`}>
                {item}
              </g>
            );
          }
        }
        items.push(
          <g key={`${y}-${x}`} transform={`translate(${x * cellSize + margin}, ${y * cellSize + margin})`}>
            {cellItems}
          </g>
        );
      }
    }

    return (
      <g>
        {items}
      </g>
    );
  }
}
