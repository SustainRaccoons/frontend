import React from "react";
import Board from "./Board.tsx";
import { isValidMove } from "./boardUtils.ts";
import { ExtendedBoardState, Location, Piece, Side, sidedPieceToPiece, sidedPieceToSide } from "./types.ts";

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

    setBoardState(state => {
      if (state.board[to[1]][to[0]] !== null) {
        console.log("takes");
      }

      const piece = state.board[from[1]][from[0]];
      const destination = state.board[to[1]][to[0]];

      state.board[from[1]][from[0]] = null;
      state.board[to[1]][to[0]] = piece;

      // en passant
      if (piece !== null && sidedPieceToPiece(piece) === Piece.Pawn) {
        const direction = from[1] - to[1];
        const didTake = from[1] != to[1];

        if (didTake && destination === null) {
          state.board[to[1] + direction][to[0]] = null;
        }
      }

      // castling
      if (piece !== null && sidedPieceToPiece(piece) === Piece.King && Math.abs(from[0] - to[0]) > 1) {
        const direction = from[0] - to[0];
        if (direction > 0) { // queen side
          const rook = state.board[to[1]][0];
          state.board[to[1]][0] = null;
          state.board[to[1]][3] = rook;
        }
        if (direction < 0) { // king side
          const rook = state.board[to[1]][7];
          state.board[to[1]][7] = null;
          state.board[to[1]][5] = rook;
        }
      }


      // en passant availability
      if (piece !== null && sidedPieceToPiece(piece) === Piece.Pawn && Math.abs(from[1] - to[1]) === 2) {
        state.enPassant = [ from[0], (from[1] + to[1]) / 2 ];
      } else {
        state.enPassant = null;
      }

      // castling availability
      if (piece !== null && sidedPieceToPiece(piece) === Piece.Rook) {
        const side = sidedPieceToSide(piece);
        if (from[0] === 0) {
          if (side === Side.White && from[1] === 7) {
            state.castling.whiteQueenSide = false;
          }
          if (side === Side.Black && from[1] === 0) {
            state.castling.blackQueenSide = false;
          }
        }
        if (from[0] === 7) {
          if (side === Side.White && from[1] === 7) {
            state.castling.whiteKingSide = false;
          }
          if (side === Side.Black && from[1] === 0) {
            state.castling.blackKingSide = false;
          }
        }
      }
      if (piece !== null && sidedPieceToPiece(piece) === Piece.King) {
        const side = sidedPieceToSide(piece);
        if (side === Side.White) {
          state.castling.whiteQueenSide = false;
          state.castling.whiteKingSide = false;
        }
        if (side === Side.Black) {
          state.castling.blackQueenSide = false;
          state.castling.blackKingSide = false;
        }
      }

      return { ...state };
    });

    return true;
  };

  return <div>
    <Board side={side} state={boardState} requestMove={handleMoveRequest} />

    <button onClick={() => document.dispatchEvent(new Event("chess:swap"))}>Swap sides</button>

    <span>Current move: {boardState.active === Side.White ? "white" : "black"}</span>
    <button onClick={() => document.dispatchEvent(new Event("chess:debug:swap_move"))}>Toggle move</button>
  </div>;
}
