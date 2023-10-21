import React from "react";
import Board from "./Board.tsx";
import { isValidMove } from "./boardUtils.ts";
import { ExtendedBoardState, Location, Piece, Side, sidedPieceToPiece } from "./types.ts";

interface Props {
  side: Side;
  boardState: ExtendedBoardState,
  setBoardState: React.Dispatch<React.SetStateAction<ExtendedBoardState>>,
}

export default function Game({ side, boardState, setBoardState }: Props) {
  const handleMoveRequest = (from: Location, to: Location) => {
    if (!isValidMove(boardState.board, from, to)) {
      return false;
    }

    setBoardState(state => {
      if (state.board[to[1]][to[0]] !== null) {
        console.log("takes");
      }

      const piece = state.board[from[1]][from[0]];
      state.board[from[1]][from[0]] = null;

      state.board[to[1]][to[0]] = piece;

      if (piece !== null && sidedPieceToPiece(piece) === Piece.Pawn && Math.abs(from[1] - to[1]) == 2) {
        state.enPassant = [ from[0], (from[1] + to[1]) / 2 ];
      } else {
        state.enPassant = null;
      }

      return { ...state };
    });

    return true;
  };

  return <Board side={side} state={boardState.board} requestMove={handleMoveRequest} />;
}
