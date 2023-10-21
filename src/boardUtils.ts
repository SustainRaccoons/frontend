import { ExtendedBoardState, Location, Piece, Side, SidedPiece, sidedPieceToPiece, sidedPieceToSide } from "./types.ts";

export function getValidMoves(state: ExtendedBoardState, location: Location): Location[] {
  const board = state.board;
  
  let allowedMoves: Location[] = [];
  let chosenSidedPiece: SidedPiece | null = board[location[1]][location[0]];

  if (chosenSidedPiece === null) {
    return [];
  }

  let chosenPiece: Piece = sidedPieceToPiece(chosenSidedPiece);
  let chosenSide: Side = sidedPieceToSide(chosenSidedPiece);
  let specificTargetLocation: Location;
  let targetSidedPiece : SidedPiece | null;
  let targetSide: Side;
  let targetLocations: Location[];


  switch (chosenPiece) {
    case Piece.Pawn:
      // pawn can theoretically move to any of the 3 squares in front of it or behind it based on its colour and if there is an enemy piece to the side
      // moving up and down

      // Moving forward one cell
      if (location[1] - 1 >= 0) {
        targetSidedPiece = board[location[1] - 1][location[0]];
        if (chosenSide === Side.White && targetSidedPiece === null) {
          allowedMoves.push([location[0], location[1] - 1]);
        }
      }

      if (location[1] + 1 <= 7) {
        targetSidedPiece = board[location[1] + 1][location[0]];
        if (chosenSide === Side.Black && targetSidedPiece === null) {
          allowedMoves.push([location[0], location[1] + 1]);
        }
      }

      
      // Moving forward two cells
      if (location[1] - 2 >= 0) {
        targetSidedPiece = board[location[1] - 2][location[0]];
        if (chosenSide === Side.White && targetSidedPiece === null && (location[1] == 6)) {
          allowedMoves.push([location[0], location[1] - 2]);
        }
      }
      
      if (location[1] + 2 <= 7) {
        targetSidedPiece = board[location[1] + 2][location[0]];
        if (chosenSide === Side.Black && targetSidedPiece === null && (location[1] == 1)) {
          allowedMoves.push([location[0], location[1] + 2]);
        }
      }
      
      

      //allowedMoves.push([location[0], location[1] + 1]);

      targetLocations = [[location[0] + 1, location[1] + 1], [location[0] - 1, location[1] + 1], [location[0] - 1, location[1] - 1], [location[0] + 1, location[1] - 1]];
      
      for (let index = 0; index < targetLocations.length; index++) {

        if (chosenSide === Side.White && ( index == 0 || index == 1)) {
          continue;
        }
        
        if (chosenSide === Side.Black && ( index == 2 || index == 3)) {
          continue;
        }


        specificTargetLocation = targetLocations[index];
        let enPassantPossible: null | Location = state.enPassant;

        if (specificTargetLocation[0] < 0 || specificTargetLocation[0] > 7 || specificTargetLocation[1] < 0 || specificTargetLocation[1] > 7) {
          continue
        }
        targetSidedPiece = board[specificTargetLocation[1]][specificTargetLocation[0]];
        //console.log("SpecTarget:", specificTargetLocation);
        //console.log("targSide:", targetSidedPiece);

        if (targetSidedPiece === null && enPassantPossible === null) {
          continue;
        }

        if (targetSidedPiece !== null) {
          targetSide = sidedPieceToSide(targetSidedPiece);

          if (chosenSide === targetSide) {
            continue;
          }

        }

        if (enPassantPossible !== null && specificTargetLocation[0] != enPassantPossible[0]) {
          continue;
        }


        allowedMoves.push([specificTargetLocation[0], specificTargetLocation[1]]);
        
      }

      break;
    
    case Piece.Rook:

      let canMoveDownRook: boolean = true;
      let canMoveUpRook: boolean = true 
      let canMoveLeftRook: boolean = true;
      let canMoveRightRook: boolean = true;

      for (let move = 1; move <= 8; move++) {

        if (location[1] + move <= 7 && canMoveDownRook == true ) {

          targetSidedPiece = board[location[1] + move][location[0]];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0], location[1] + move]);
          } else {
            canMoveDownRook = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0], location[1] + move]);
            }
          }
        
        }

        if (location[1] - move >= 0 && canMoveUpRook == true) {

          targetSidedPiece = board[location[1] - move][location[0]];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0], location[1] - move]);
          } else {
            canMoveUpRook = false
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0], location[1] - move]);
            }
          }
        
        }

        if (location[0] + move <= 7 && canMoveRightRook == true) {

          targetSidedPiece = board[location[1]][location[0] + move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] + move, location[1]]);
          } else {
            canMoveRightRook = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] + move, location[1]]);
            }
          }
        
        }

        if (location[0] - move >= 0 && canMoveLeftRook == true) {

          targetSidedPiece = board[location[1]][location[0] - move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] - move, location[1]]);
          } else {
            canMoveLeftRook = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] - move, location[1]]);
            }
          }
        
        
        }

          
      }
      
      break;

    case Piece.Knight:


      targetLocations = [[location[0] + 1, location[1] + 2], [location[0] + 2, location[1] + 1],
                         [location[0] + 1, location[1] - 2], [location[0] + 2, location[1] - 1],
                         [location[0] - 1, location[1] + 2], [location[0] - 2, location[1] + 1],
                         [location[0] - 1, location[1] - 2], [location[0] - 2, location[1] - 1]];
      
      for (let index = 0; index < targetLocations.length; index++) {

        specificTargetLocation = targetLocations[index];

        if (specificTargetLocation[0] >= 0 && specificTargetLocation[0] < 8 && specificTargetLocation[1] >= 0 && specificTargetLocation[1] < 8) {
          targetSidedPiece = board[specificTargetLocation[1]][specificTargetLocation[0]];

          if (targetSidedPiece !== null) {
            targetSide = sidedPieceToSide(targetSidedPiece);

            if (chosenSide === targetSide) {
              continue;
            }
          }

          allowedMoves.push([specificTargetLocation[0], specificTargetLocation[1]]);
          
        }
        
      }

      break;

    case Piece.Bishop:

      let canMoveUpRightBishop: boolean = true;
      let canMoveDownRightBishop: boolean = true 
      let canMoveDownLeftBishop: boolean = true;
      let canMoveUpLeftBishop: boolean = true;

      for (let move = 1; move <= 8; move++) {

        
        if (location[1] + move <= 7 && location[0] - move >= 0 && canMoveUpRightBishop == true ) {

          targetSidedPiece = board[location[1] + move][location[0] - move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] - move, location[1] + move]);
          } else {
            canMoveUpRightBishop = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] - move, location[1] + move]);
            }
          }
        
        }
        
        if (location[1] + move <= 7 && location[0] + move <= 7 && canMoveDownRightBishop == true) {

          targetSidedPiece = board[location[1] + move][location[0] + move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] + move, location[1] + move]);
          } else {
            canMoveDownRightBishop = false
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] + move, location[1] + move]);
            }
          }
        
        }
        
        if (location[0] + move <= 7 && location[1] - move >= 0 && canMoveDownLeftBishop == true) {

          targetSidedPiece = board[location[1] - move][location[0] + move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] + move, location[1] - move]);
          } else {
            canMoveDownLeftBishop = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] + move, location[1] - move]);
            }
          }
        
        }

        if (location[0] - move >= 0 && location[1] - move >= 0 && canMoveUpLeftBishop == true) {

          targetSidedPiece = board[location[1] - move][location[0] - move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] - move, location[1] - move]);
          } else {
            canMoveUpLeftBishop = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] - move, location[1] - move]);
            }
          }
        
        
        }

          
      }

      break;

    
    ////////////////////////////////// QUEEN ///////////////////////////////////
    case Piece.Queen:

      let canMoveUpRightQueen: boolean = true;
      let canMoveDownRightQueen: boolean = true 
      let canMoveDownLeftQueen: boolean = true;
      let canMoveUpLeftQueen: boolean = true;
      let canMoveDownQueen: boolean = true;
      let canMoveUpQueen: boolean = true 
      let canMoveLeftQueen: boolean = true;
      let canMoveRightQueen: boolean = true;

      for (let move = 1; move <= 8; move++) {

        if (location[1] + move <= 7 && canMoveDownQueen == true ) {

          targetSidedPiece = board[location[1] + move][location[0]];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0], location[1] + move]);
          } else {
            canMoveDownQueen = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0], location[1] + move]);
            }
          }
        
        }

        if (location[1] - move >= 0 && canMoveUpQueen == true) {

          targetSidedPiece = board[location[1] - move][location[0]];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0], location[1] - move]);
          } else {
            canMoveUpQueen = false
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0], location[1] - move]);
            }
          }
        
        }

        if (location[0] + move <= 7 && canMoveRightQueen == true) {

          targetSidedPiece = board[location[1]][location[0] + move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] + move, location[1]]);
          } else {
            canMoveRightQueen = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] + move, location[1]]);
            }
          }
        
        }

        if (location[0] - move >= 0 && canMoveLeftQueen == true) {

          targetSidedPiece = board[location[1]][location[0] - move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] - move, location[1]]);
          } else {
            canMoveLeftQueen = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] - move, location[1]]);
            }
          }
        
        
        }

        
        if (location[1] + move <= 7 && location[0] - move >= 0 && canMoveUpRightQueen == true ) {

          targetSidedPiece = board[location[1] + move][location[0] - move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] - move, location[1] + move]);
          } else {
            canMoveUpRightQueen = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] - move, location[1] + move]);
            }
          }
        
        }
        
        if (location[1] + move <= 7 && location[0] + move <= 7 && canMoveDownRightQueen== true) {

          targetSidedPiece = board[location[1] + move][location[0] + move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] + move, location[1] + move]);
          } else {
            canMoveDownRightQueen = false
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] + move, location[1] + move]);
            }
          }
        
        }
        
        if (location[0] + move <= 7 && location[1] - move >= 0 && canMoveDownLeftQueen == true) {

          targetSidedPiece = board[location[1] - move][location[0] + move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] + move, location[1] - move]);
          } else {
            canMoveDownLeftQueen = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] + move, location[1] - move]);
            }
          }
        
        }

        if (location[0] - move >= 0 && location[1] - move >= 0 && canMoveUpLeftQueen == true) {

          targetSidedPiece = board[location[1] - move][location[0] - move];

          if (targetSidedPiece === null) {
            allowedMoves.push([location[0] - move, location[1] - move]);
          } else {
            canMoveUpLeftQueen = false;
            targetSide = sidedPieceToSide(targetSidedPiece);
            if (chosenSide !== targetSide) {
              allowedMoves.push([location[0] - move, location[1] - move]);
            }
          }
        
        
        }

      }

      break;


    ///////////////////////////////////////////// KING ///////////////////////////////////////////
    case Piece.King:

    targetLocations = [[location[0], location[1] - 1], [location[0] + 1, location[1] - 1],
                      [location[0] + 1, location[1]], [location[0] + 1, location[1] + 1],
                      [location[0], location[1] + 1], [location[0] - 1, location[1] + 1],
                      [location[0] - 1, location[1]], [location[0] - 1, location[1] - 1]];

      for (let index = 0; index < targetLocations.length; index++) {

        specificTargetLocation = targetLocations[index];

        if (specificTargetLocation[0] >= 0 && specificTargetLocation[0] <= 7 && specificTargetLocation[1] >= 0 && specificTargetLocation[1] <= 7) {
          targetSidedPiece = board[specificTargetLocation[1]][specificTargetLocation[0]];

          if (targetSidedPiece !== null) {
            targetSide = sidedPieceToSide(targetSidedPiece);

            if (chosenSide === targetSide) {
              continue;
            }
          }

          allowedMoves.push([specificTargetLocation[0], specificTargetLocation[1]]);
          
        }
        
      }

      if (chosenSide === Side.White) {
        if (state.castling.whiteKingSide === true) {
          allowedMoves.push([7, 6]);
        } else if (state.castling.whiteQueenSide === true) {
          allowedMoves.push([7, 2]);
        }
      } else {
        if (state.castling.blackKingSide === true) {
          allowedMoves.push([0, 6]);
        } else if (state.castling.blackQueenSide === true) {
          allowedMoves.push([0, 2]);
        }
      }

      break;

    default:
      break;

  }
  return allowedMoves;

}

export function isValidMove(state: ExtendedBoardState, from: Location, to: Location): boolean {
  const board = state.board;

  let currentSidedPiece: SidedPiece | null;
  currentSidedPiece = board[from[1]][from[0]];

  if (currentSidedPiece === null) {
    return false
  }

  let currentPiece: Piece = sidedPieceToPiece(currentSidedPiece);

  let currentSide: Side = sidedPieceToSide(currentSidedPiece);

  let allowedmoves: Location[] = getValidMoves(state, from);

  for (let index = 0; index < allowedmoves.length; index++) {
    if (to[0] === allowedmoves[index][0] && to[1] === allowedmoves[index][1]) {
      return true;
    }
  }
    
  return false;
}

export function isInCheck(state: ExtendedBoardState, side: Side): boolean {
  const board = state.board;

  let kingPos: Location = [ 0, 0 ];
  const opponentPositions: Location[] = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];

      if (piece === null) {
        continue;
      }

      const pieceSide = sidedPieceToSide(piece);

      if (pieceSide === side) {
        if (sidedPieceToPiece(piece) === Piece.King) {
          kingPos = [ x, y ];
        }
      } else {
        opponentPositions.push([ x, y ]);
      }
    }
  }

  for (const position of opponentPositions) {
    for (let move of getValidMoves(state, position)) {
      if (move[0] === kingPos[0] && move[1] === kingPos[1]) {
        return true;
      }
    }
  }

  return false;
}
