import { useState } from "react";

import { Puzzle } from "./puzzle";

type ItemSelectorProps<T> = {
  puzzle: Puzzle<T>;
  layer: number;
  unitSize: number;
  selectedItem: T | null;
  setSelectedItem: (items: T | null) => void;
};

const ItemSelector = <T,>(props: ItemSelectorProps<T>) => {
  const { puzzle, layer, unitSize, selectedItem, setSelectedItem } = props;
  const items = puzzle.getEditableItems(layer);

  const svg = [];
  const margin = 2;

  for (let i = 0; i < items.length; ++i) {
    if (items[i] !== selectedItem) {
        svg.push(<rect x={i * unitSize + margin} y={margin} width={unitSize} height={unitSize} fill="none" stroke="#cccccc" strokeWidth="1" />);
      }
  }

  for (let i = 0; i < items.length; ++i) {
    svg.push(<g key={i} transform={`translate(${i * unitSize + margin}, ${margin})`}>
      {puzzle.renderItem(items[i], unitSize)}
    </g>);
  }

  for (let i = 0; i < items.length; ++i) {
    if (items[i] === selectedItem) {
        svg.push(<rect x={i * unitSize + margin} y={margin} width={unitSize} height={unitSize} fill="none" stroke="red" strokeWidth="2" />);
      }
  }

  const handleClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const index = Math.floor((event.nativeEvent.offsetX - margin) / unitSize);
    if (0 <= index && index < items.length) {
      setSelectedItem(items[index]);
    }
  };

return (<svg width={unitSize * items.length + margin * 2} height={unitSize + margin * 2} onClick={handleClick}>
    {svg}
  </svg>);
};

export type EditorProps<T, P extends Puzzle<T>> = {
  puzzle: P;
  updatePuzzle: (puzzle: P) => void;
};

export const Editor = <T, P extends Puzzle<T>>(props: EditorProps<T, P>) => {
  const puzzle = props.puzzle;
  const numLayers = puzzle.numLayers();
  const [selectedItem, setSelectedItem] = useState<({layer: number; item: T} | null)>(null);

  const unitSize = 40;

  const itemSelectors = [];
  for (let i = 0; i < numLayers; ++i) {
    let item: T | null = null;
    if (selectedItem !== null && selectedItem.layer === i) {
      item = selectedItem.item;
    }
    itemSelectors.push(<div>
      <ItemSelector key={i} puzzle={puzzle} layer={i} unitSize={unitSize} selectedItem={item} setSelectedItem={item => {
        if (item !== null) {
          setSelectedItem({layer: i, item: item});
        }
      }} />
    </div>);
  }

  const [renderHeight, renderWidth] = puzzle.renderSize(unitSize);

  const [updateItem, setUpdateItem] = useState<T | null>(null);

  const onMouseMove = (event: React.MouseEvent<SVGElement, MouseEvent>, updateItemOverride: T | null) => {
    const item = updateItemOverride !== null ? updateItemOverride : updateItem;
    if (item === null) {
      return;
    }

    const pt = puzzle.mouseToCell(event.nativeEvent.offsetY, event.nativeEvent.offsetX, unitSize);
    if (pt === null) {
      return;
    }

    const [y, x] = pt;
    if (selectedItem !== null) {
      const newPuzzle = puzzle.setCell(y, x, selectedItem.layer, item);
      if (newPuzzle !== null) {
        props.updatePuzzle(newPuzzle);
      }
    }
  };

  const onMouseDown = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    if (selectedItem === null) {
      return null;
    }

    let item = null;
    if (event.button === 2) {
      const layer = selectedItem.layer;
      item = puzzle.getEditableItems(layer)[0];
    } else {
      item = selectedItem.item;
    }

    setUpdateItem(item);
    onMouseMove(event, item);
  };

  return (<div>
    <div>
      {itemSelectors}
    </div>
    <div>
      <svg
        width={renderWidth}
        height={renderHeight}
        onMouseDown={onMouseDown}
        onMouseMove={(e) => { onMouseMove(e, null); }}
        onMouseUp={() => setUpdateItem(null)}
        onMouseLeave={() => setUpdateItem(null)}
        onContextMenu={(e) => { e.preventDefault(); }}
      >
        {puzzle.render(unitSize)}
      </svg>
    </div>
  </div>);
};
