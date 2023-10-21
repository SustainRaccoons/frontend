import React from "react";
import Board from "./Board.tsx";
import { getBoardStateAfterMove, isValidMove } from "./boardUtils.ts";
import { ExtendedBoardState, Location, Side } from "./types.ts";

interface Props {
  side: Side;
  boardState: ExtendedBoardState,
  setBoardState: React.Dispatch<React.SetStateAction<ExtendedBoardState>>,
}

export default function Game({ side, boardState, setBoardState }: Props) {
  const handleMoveRequest = (from: Location, to: Location) => {
    if (!isValidMove(boardState, from, to)) {
      return false;
    }

    const piece = boardState.board[from[1]][from[0]];
    if (piece === null) {
      return false;
    }

    setBoardState(state => {
      const boardStateAfterMove = getBoardStateAfterMove(state, from, to);

      document.dispatchEvent(new CustomEvent("chess:move", {
        detail: boardStateAfterMove.lastMove,
      }));

      return boardStateAfterMove;
    });
    return true;
  };

  return <div>
    <Board side={side} state={boardState} requestMove={handleMoveRequest} />

    <button onClick={() => document.dispatchEvent(new Event("chess:swap"))}>Swap sides</button>

    <span>Current move: {boardState.active === Side.White ? "white" : "black"}</span>
    <button onClick={() => document.dispatchEvent(new Event("chess:skip"))}>Toggle move</button>
  </div>;
}
