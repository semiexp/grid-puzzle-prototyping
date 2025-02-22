import { JSX } from "react";

import { Move, Puzzle } from "./puzzle";

export type Item = "empty" | "player" | "wall";

export class SimplePuzzle extends Puzzle<Item> {
  private height: number;
  private width: number;
  private grid: Item[][][];

  constructor() {
    super();

    this.height = 10;
    this.width = 10;
    this.grid = [];

    for (let layer = 0; layer < this.numLayers(); ++layer) {
      this.grid.push([]);
      for (let y = 0; y < this.height; ++y) {
        this.grid[layer].push([]);
        for (let x = 0; x < this.width; ++x) {
          this.grid[layer][y].push("empty");
        }
      }
    }
  }

  fromJSON(json: string): this {
    const data = JSON.parse(json);
    const ret = new SimplePuzzle();
    ret.height = data.height;
    ret.width = data.width;
    ret.grid = data.grid;
    return ret as this;
  }

  toJSON(): string {
    return JSON.stringify({
      height: this.height,
      width: this.width,
      grid: this.grid,
    });
  }

  gridSize(): [number, number] {
    return [this.height, this.width];
  }

  numLayers(): number {
    return 2;
  }

  getEditableItems(layer: number): Item[] {
    if (layer === 0) {
      return ["empty", "wall"];
    } else {
      return ["empty", "player"];
    }
  }

  getCell(y: number, x: number, layer: number): Item {
    return this.grid[layer][y][x];
  }

  setCell(y: number, x: number, layer: number, value: Item): this | null {
    const newGrid = this.grid.map(layer => layer.map(row => row.slice()));
    newGrid[layer][y][x] = value;

    const ret = new SimplePuzzle();
    ret.height = this.height;
    ret.width = this.width;
    ret.grid = newGrid;
    return ret as this;
  }

  resize(height: number, width: number): this {
    const newGrid: Item[][][] = [];
    for (let layer = 0; layer < this.numLayers(); ++layer) {
      newGrid.push([]);
      for (let y = 0; y < height; ++y) {
        newGrid[layer].push([]);
        for (let x = 0; x < width; ++x) {
          newGrid[layer][y].push(y < this.height && x < this.width ? this.grid[layer][y][x] : "empty");
        }
      }
    }

    const ret = new SimplePuzzle();
    ret.height = height;
    ret.width = width;
    ret.grid = newGrid;

    return ret as this;
  }

  asPlayMode(): this {
    const playMode = new SimplePuzzle();
    playMode.height = this.height;
    playMode.width = this.width;
    playMode.grid = this.grid.map(layer => layer.map(row => row.slice()));
    return playMode as this;
  }

  move(move: Move): this | null {
    const playerLayer = 1;
    const playerY = this.grid[playerLayer].findIndex(row => row.includes("player"));
    const playerX = this.grid[playerLayer][playerY].indexOf("player");

    const newPlayerY = playerY + (move === "down" ? 1 : move === "up" ? -1 : 0);
    const newPlayerX = playerX + (move === "right" ? 1 : move === "left" ? -1 : 0);

    if (newPlayerY < 0 || newPlayerY >= this.height || newPlayerX < 0 || newPlayerX >= this.width) {
      return null;
    }

    if (this.grid[0][newPlayerY][newPlayerX] === "wall") {
      return null;
    }

    const newGrid = this.grid.map(layer => layer.map(row => row.slice()));
    newGrid[playerLayer][playerY][playerX] = "empty";
    newGrid[playerLayer][newPlayerY][newPlayerX] = "player";

    const ret = new SimplePuzzle();
    ret.height = this.height;
    ret.width = this.width;
    ret.grid = newGrid;

    return ret as this;
  }

  renderItem(item: Item, cellSize: number): JSX.Element | null {
    if (item === "empty") {
      return null;
    }

    if (item === "wall") {
      return <rect y={0} x={0} width={cellSize} height={cellSize} fill="#999999" />;
    }

    if (item === "player") {
      return <circle cx={cellSize / 2} cy={cellSize / 2} r={cellSize * 0.4} fill="#ff0000" />;
    }

    return null;
  }
}
