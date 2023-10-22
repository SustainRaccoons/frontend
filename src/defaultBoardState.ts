import {BoardState, ExtendedBoardState, Side, SidedPiece} from "./types.ts";

export default function makeDefaultBoard(): BoardState {
  return [
    [
      SidedPiece.BlackRook,
      SidedPiece.BlackKnight,
      SidedPiece.BlackBishop,
      SidedPiece.BlackQueen,
      SidedPiece.BlackKing,
      SidedPiece.BlackBishop,
      SidedPiece.BlackKnight,
      SidedPiece.BlackRook,
    ],
    [
      SidedPiece.BlackPawn,
      SidedPiece.BlackPawn,
      SidedPiece.BlackPawn,
      SidedPiece.BlackPawn,
      SidedPiece.BlackPawn,
      SidedPiece.BlackPawn,
      SidedPiece.BlackPawn,
      SidedPiece.BlackPawn,
    ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [
      SidedPiece.WhitePawn,
      SidedPiece.WhitePawn,
      SidedPiece.WhitePawn,
      SidedPiece.WhitePawn,
      SidedPiece.WhitePawn,
      SidedPiece.WhitePawn,
      SidedPiece.WhitePawn,
      SidedPiece.WhitePawn,
    ],
    [
      SidedPiece.WhiteRook,
      SidedPiece.WhiteKnight,
      SidedPiece.WhiteBishop,
      SidedPiece.WhiteQueen,
      SidedPiece.WhiteKing,
      SidedPiece.WhiteBishop,
      SidedPiece.WhiteKnight,
      SidedPiece.WhiteRook,
    ],
  ];
}

export function makeDefaultExtendedBoardState(): ExtendedBoardState {
  return {
    board: makeDefaultBoard(),
    active: Side.White,
    castling: {
      whiteKingSide: true,
      whiteQueenSide: true,
      blackKingSide: true,
      blackQueenSide: true,
    },
    enPassant: null,
    fullMoves: 1,
    halfMoveClock: 0,
    lastMoveTime: 0,
  };
}
