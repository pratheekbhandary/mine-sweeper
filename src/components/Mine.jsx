import React, { useCallback } from "react";
import { mineWidth } from "../util/constants";

function Mine({ mine, onClick, onRightClick }) {
  const getDisplayNumber = useCallback(() => {
    if (mine.isMarked) {
      return "🚩";
    } else if (mine.isClicked) {
      if (mine.isMine) {
        return "💣";
      } else if (mine.surroundingMineCount !== 0) {
        return mine.surroundingMineCount;
      }
    }
  }, [mine]);
  return (
    <div
      style={{
        width: `${mineWidth}px`,
        height: `${mineWidth}px`,
        lineHeight: `${mineWidth}px`,
        border: "1px solid black",
        boxSizing: "border-box",
        textAlign: "center",
        background: mine.isClicked ? "rgb(188 192 230)" : "",
      }}
      onClick={() => onClick(mine.id)}
      onContextMenu={(e) => onRightClick(e, mine.id)}
    >
      {getDisplayNumber()}
    </div>
  );
}

export default Mine;
