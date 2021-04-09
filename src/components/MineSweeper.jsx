import React, { useState, useCallback, useMemo } from "react";
import Mine from "./Mine";
import MineContainer from "./MineContainer";

import { mineWidth } from "../util/constants";

function MineSweeper({ rows }) {
  const [mines, setMines] = useState(generateMines(rows ** 2));
  const [won, setWon] = useState(null);

  const onClick = useCallback(
    (id) => {
      if (mines[id].isMine) {
        setWon(false);
      }
      setMines((mines) => {
        mines[id].isClicked = true;
        mines = burstPlainLand(rows, mines, id);
        return [...mines];
      });
    },
    [rows, mines, setMines]
  );

  const onRightClick = useCallback(
    (e, id) => {
      e.preventDefault();
      setMines((mines) => {
        const newMines = [...mines];
        newMines[id] = { ...newMines[id], isMarked: !newMines[id].isMarked };
        if (newMines.filter((m) => m.isMine).every((m) => m.isMarked)) {
          setWon(true);
        }
        return newMines;
      });
    },
    [setMines, setWon]
  );
  const totalMines = useMemo(
    () =>
      mines.reduce((acc, curr) => {
        return curr.isMine ? ++acc : acc;
      }, 0),
    []
  );
  return (
    <>
      {won !== null && (won ? <div>You won</div> : <div>You loose</div>)}
      <div>Total mines: {totalMines}</div>
      <MineContainer
        mines={mines}
        style={{
          display: "flex",
          width: `${mineWidth * rows}px`,
          flexWrap: "wrap",
          border: "1px solid black",
        }}
      >
        {mines.map((mine) => (
          <Mine
            mine={mine}
            key={mine.id}
            onClick={onClick}
            onRightClick={onRightClick}
          />
        ))}
      </MineContainer>
    </>
  );
}

export default MineSweeper;

function getMineLocations(size) {
  const mineIntensity = 0.5;
  const mineCount = Math.floor(Math.random() * size * mineIntensity);
  const mineLocations = new Set();
  for (let i = 0; i < mineCount; i++) {
    mineLocations.add(Math.floor(Math.random() * size));
  }
  return Array.from(mineLocations);
}

function getSurroundingMineCount(size, mineLocations, index) {
  const neighbors = getNeighbors(size, index);
  const mineCount = neighbors.reduce((acc, curr) => {
    if (mineLocations.includes(curr)) {
      return acc + 1;
    }
    return acc;
  }, 0);
  return mineCount;
}

function getNeighbors(size, index) {
  const totalRows = Math.sqrt(size);
  const currentRow = Math.floor(index / totalRows);
  const currentCol = index % totalRows;
  const surroundingEles = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  const neighbors = [];
  surroundingEles.forEach((ele) => {
    const [x, y] = [currentCol - ele[0], currentRow - ele[1]];
    if (x < 0 || y < 0 || x >= totalRows || y >= totalRows) {
      return;
    }
    const neighborIndex = y * totalRows + x;
    neighbors.push(neighborIndex);
  });
  return neighbors;
}

function generateMines(size) {
  const mineLocations = getMineLocations(size);
  const mines = Array.from(Array(size)).map((_, i) => {
    const mine = {
      id: i,
      isMine: false,
      isClicked: false,
      surroundingMineCount: 0,
      isMarked: false,
    };
    if (mineLocations.includes(i)) {
      mine.isMine = true;
    } else {
      mine.surroundingMineCount = getSurroundingMineCount(
        size,
        mineLocations,
        i
      );
    }
    return mine;
  });
  return mines;
}

function burstPlainLand(rows, mines, index) {
  const neighbors = getNeighbors(rows ** 2, index);
  neighbors.forEach((neighborIndex) => {
    const mine = mines[neighborIndex];
    if (!mine.isMine && mine.surroundingMineCount === 0 && !mine.isClicked) {
      mine.isClicked = true;
      mines = burstPlainLand(rows, mines, mine.id);
    }
  });
  return mines;
}
