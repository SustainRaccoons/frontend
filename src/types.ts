export enum GameType {
  Local,
  OnlineHost,
  OnlineClient,
}

export enum Side {
  White,
  Black,
}

export enum Piece {
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
}

export enum SidedPiece {
  WhitePawn = Piece.Pawn | Side.White << 3,
  WhiteRook = Piece.Rook | Side.White << 3,
  WhiteKnight = Piece.Knight | Side.White << 3,
  WhiteBishop = Piece.Bishop | Side.White << 3,
  WhiteQueen = Piece.Queen | Side.White << 3,
  WhiteKing = Piece.King | Side.White << 3,
  BlackPawn = Piece.Pawn | Side.Black << 3,
  BlackRook = Piece.Rook | Side.Black << 3,
  BlackKnight = Piece.Knight | Side.Black << 3,
  BlackBishop = Piece.Bishop | Side.Black << 3,
  BlackQueen = Piece.Queen | Side.Black << 3,
  BlackKing = Piece.King | Side.Black << 3,
}

export type BoardState = (SidedPiece | null)[][];

export interface ExtendedBoardState {
  board: BoardState;
  active: Side;
  castling: {
    whiteKingSide: boolean,
    whiteQueenSide: boolean,
    blackKingSide: boolean,
    blackQueenSide: boolean,
  };
  enPassant: null | Location;
  halfMoveClock: number,
  fullMoveClock: number,
}

export type Location = [ number, number ];

export const sidedPieceToNotationMap: Record<SidedPiece, string> = {
  [SidedPiece.WhitePawn]: "P",
  [SidedPiece.WhiteRook]: "R",
  [SidedPiece.WhiteKnight]: "N",
  [SidedPiece.WhiteBishop]: "B",
  [SidedPiece.WhiteQueen]: "Q",
  [SidedPiece.WhiteKing]: "K",
  [SidedPiece.BlackPawn]: "p",
  [SidedPiece.BlackRook]: "r",
  [SidedPiece.BlackKnight]: "n",
  [SidedPiece.BlackBishop]: "b",
  [SidedPiece.BlackQueen]: "q",
  [SidedPiece.BlackKing]: "k",
} as const;

export const notationToSidedPieceMap: Record<string, SidedPiece> = {
  ["P"]: SidedPiece.WhitePawn,
  ["R"]: SidedPiece.WhiteRook,
  ["N"]: SidedPiece.WhiteKnight,
  ["B"]: SidedPiece.WhiteBishop,
  ["Q"]: SidedPiece.WhiteQueen,
  ["K"]: SidedPiece.WhiteKing,
  ["p"]: SidedPiece.BlackPawn,
  ["r"]: SidedPiece.BlackRook,
  ["n"]: SidedPiece.BlackKnight,
  ["b"]: SidedPiece.BlackBishop,
  ["q"]: SidedPiece.BlackQueen,
  ["k"]: SidedPiece.BlackKing,
} as const;

export function sidedPieceToPiece(piece: SidedPiece): Piece {
  return piece & 7;
}

export function sidedPieceToSide(piece: SidedPiece): Side {
  return piece << 3;
}
