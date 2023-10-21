import React from "react";
import Board from "./Board.tsx";
import { isValidMove } from "./boardUtils.ts";
import { BoardState, Location, Side } from "./types.ts";

interface Props {
  side: Side;
  boardState: BoardState,
  setBoardState: React.Dispatch<React.SetStateAction<BoardState>>,
}

export default function Game({ side, boardState, setBoardState }: Props) {
  const handleMoveRequest = (from: Location, to: Location) => {
    if (!isValidMove(boardState, from, to)) {
      return;
    }

    setBoardState(board => {
      if (board[to[1]][to[0]] !== null) {
        console.log("takes");
      }

      const piece = board[from[1]][from[0]];
      board[from[1]][from[0]] = null;

      board[to[1]][to[0]] = piece;

      return [ ...board ];
    });
  };

  return <Board side={side} state={boardState} requestMove={handleMoveRequest} />;
}
