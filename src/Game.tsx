import React from "react";
import Board from "./Board.tsx";
import { isValidMove } from "./boardUtils.ts";
import { ExtendedBoardState, Location, Side } from "./types.ts";

interface Props {
  side: Side;
  boardState: ExtendedBoardState,
  setBoardState: React.Dispatch<React.SetStateAction<ExtendedBoardState>>,
}

export default function Game({ side, boardState, setBoardState }: Props) {
  const handleMoveRequest = (from: Location, to: Location) => {
    if (!isValidMove(boardState.board, from, to)) {
      return;
    }

    setBoardState(state => {
      if (state.board[to[1]][to[0]] !== null) {
        console.log("takes");
      }

      const piece = state.board[from[1]][from[0]];
      state.board[from[1]][from[0]] = null;

      state.board[to[1]][to[0]] = piece;

      return { ...state };
    });
  };

  return <Board side={side} state={boardState.board} requestMove={handleMoveRequest} />;
}
