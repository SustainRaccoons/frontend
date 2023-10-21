import blackBishop from "./Assets/black_bishop_16px.png";
import blackKing from "./Assets/black_king_16px.png";
import blackKnight from "./Assets/black_knight_16px.png";
import blackPawn from "./Assets/black_pawn_16px.png";
import blackQueen from "./Assets/black_queen_16px.png";
import blackRook from "./Assets/black_rook_16px.png";
import emptyTile from "./Assets/empty_16px.png";
import whiteBishop from "./Assets/white_bishop_16px.png";
import whiteKing from "./Assets/white_king_16px.png";
import whiteKnight from "./Assets/white_knight_16px.png";
import whitePawn from "./Assets/white_pawn_16px.png";
import whiteQueen from "./Assets/white_queen_16px.png";
import whiteRook from "./Assets/white_rook_16px.png";
import { SidedPiece } from "./types.ts";

export const pieces: Record<SidedPiece, any> = {
  [SidedPiece.WhitePawn]: whitePawn,
  [SidedPiece.WhiteRook]: whiteRook,
  [SidedPiece.WhiteKnight]: whiteKnight,
  [SidedPiece.WhiteBishop]: whiteBishop,
  [SidedPiece.WhiteQueen]: whiteQueen,
  [SidedPiece.WhiteKing]: whiteKing,
  [SidedPiece.BlackPawn]: blackPawn,
  [SidedPiece.BlackRook]: blackRook,
  [SidedPiece.BlackKnight]: blackKnight,
  [SidedPiece.BlackBishop]: blackBishop,
  [SidedPiece.BlackQueen]: blackQueen,
  [SidedPiece.BlackKing]: blackKing,
};
export { emptyTile };
