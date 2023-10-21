import { BoardState, Location, Piece, SidedPiece, sidedPieceToPiece } from "./types.ts";

export function fullPieceMoves(piece: Piece, location: Location): Location[] {

  let allowedMoves: Location[] = [];
  switch (piece) {
    case Piece.Pawn:
      // pawn can theoretically move to any of the 3 squares in front of it or behind it based on its colour and if there is an enemy piece to the side
      // moving up and down
      allowedMoves.push([location[0], location[1] + 1]);
      allowedMoves.push([location[0], location[1] - 1]);

      allowedMoves.push([location[0] + 1, location[1] + 1]);
      allowedMoves.push([location[0] + 1, location[1] + 1]);

      allowedMoves.push([location[0] - 1, location[1] - 1]);
      allowedMoves.push([location[0] + 1, location[1] - 1]);

      break;
    
    case Piece.Rook:

      for (let index = 1; index <= 8; index++) {

        allowedMoves.push([location[0] + index, location[1]]);;

        allowedMoves.push([location[0] - index, location[1]]);;

        allowedMoves.push([location[0], location[1] + index]);;

        allowedMoves.push([location[0], location[1] - index]);;
        
      }
      
      break;

    case Piece.Knight:

      allowedMoves.push([location[0] + 1, location[1] + 2]);
      allowedMoves.push([location[0] + 2, location[1] + 1]);

      allowedMoves.push([location[0] + 1, location[1] - 2]);
      allowedMoves.push([location[0] + 2, location[1] - 1]);     

      allowedMoves.push([location[0] - 1, location[1] + 2]);
      allowedMoves.push([location[0] - 2, location[1] + 1]);     

      allowedMoves.push([location[0] - 1, location[1] - 2]);
      allowedMoves.push([location[0] - 2, location[1] - 1]);     
      
      break;

    case Piece.Bishop:

      for (let index = 1; index <= 8; index++) {

        allowedMoves.push([location[0] + index, location[1] + index]);

        allowedMoves.push([location[0] - index, location[1] - index]);

        allowedMoves.push([location[0] + index, location[1] - index]);

        allowedMoves.push([location[0] - index, location[1] + index]);
        
      }
      
      break;

    case Piece.Queen:

      for (let index = 1; index <= 8; index++) {

        // Diagonals
        allowedMoves.push([location[0] + index, location[1] + index]);
        allowedMoves.push([location[0] - index, location[1] - index]);
        allowedMoves.push([location[0] + index, location[1] - index]);
        allowedMoves.push([location[0] - index, location[1] + index]);
        // Straight lines
        allowedMoves.push([location[0] + index, location[1]]);;
        allowedMoves.push([location[0] - index, location[1]]);;
        allowedMoves.push([location[0], location[1] + index]);;
        allowedMoves.push([location[0], location[1] - index]);;
        
      }

      break;

    case Piece.King:

      allowedMoves.push([location[0], location[1] - 1]);
      allowedMoves.push([location[0] + 1, location[1] - 1]);
      allowedMoves.push([location[0] + 1, location[1]]);
      allowedMoves.push([location[0] + 1, location[1] + 1]);
      allowedMoves.push([location[0], location[1] + 1]);
      allowedMoves.push([location[0] - 1, location[1] + 1]);
      allowedMoves.push([location[0] - 1, location[1]]);
      allowedMoves.push([location[0] - 1, location[1] - 1]);

      break;

    default:
      break;

  }
  return allowedMoves;
}

export function getValidMoves(board: BoardState, position: Location): Location[] {
  return [];
}

export function isValidMove(board: BoardState, from: Location, to: Location): boolean {

  let currentSidedPiece: SidedPiece | null;
  currentSidedPiece = board[from[1]][from[0]];
  console.log(from[0], from[1]);
  console.log(currentSidedPiece);

  if (currentSidedPiece === null) {
    return false
  }

  console.log("Sided Piece Get");

  let currentPiece: Piece = sidedPieceToPiece(currentSidedPiece);

  let allowedmoves: Location[] = fullPieceMoves(currentPiece, from)

  for (let index = 0; index < allowedmoves.length; index++) {
    console.log("Allowed Moves:", allowedmoves[index]);
    console.log("To:", to);
    if (to[0] === allowedmoves[index][0] && to[1] === allowedmoves[index][1]) {
      console.log("Check check");
      return true;
    }
  }
    
  return false;
}
