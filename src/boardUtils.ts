import { BoardState, Location, Piece } from "./types.ts";

export function fullPieceMoves(piece: Piece, location: Location): Location[] {

  let allowedMoves: Location[] = [];
  switch (piece) {
    case Piece.Pawn:
      // pawn can theoretically move to any of the 3 squares in front of it or behind it based on its colour and if there is an enemy piece to the side
      // moving up and down
      allowedMoves.push([location[0] - 1, location[1]]);
      allowedMoves.push([location[0] + 1, location[1]]);
      
      allowedMoves.push([location[0] - 1, location[1] + 1]);
      allowedMoves.push([location[0] + 1, location[1] + 1]);

      allowedMoves.push([location[0] - 1, location[1] - 1]);
      allowedMoves.push([location[0] + 1, location[1] - 1]);

      break;
    
    case Piece.Rook:

    for (let index = 0; index < 8; index++) {
      allowedMoves.push([location[0] + index, location[1]]);;
      
    }
      
      break;

    case Piece.Knight:
      
      break;

    case Piece.Bishop:
      
      break;

    default:
      break;

  }
  return [];
}

export function getValidMoves(board: BoardState, position: Location): Location[] {
  return [];
}

export function isValidMove(board: BoardState, from: Location, to: Location): boolean {
  return true;
}
