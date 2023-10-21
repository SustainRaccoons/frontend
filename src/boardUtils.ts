import { ExtendedBoardState, GameOver, invertSide, Location, Piece, Side, SidedPiece, sidedPieceToPiece, sidedPieceToSide } from "./types.ts";

export function getValidMoves(state: ExtendedBoardState, location: Location, isRecursed: boolean = false): Location[] {
  const board = state.board;
  
  let allowedMoves: Location[] = [];
  let chosenSidedPiece: SidedPiece | null = board[location[1]][location[0]];
  let futureBoard: ExtendedBoardState;
  let move: number;

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

          allowedMoves.push([specificTargetLocation[0], specificTargetLocation[1]]);
          continue;

        }

        if (enPassantPossible !== null && specificTargetLocation[0] !== enPassantPossible[0]) {
          continue;
        }

        if (enPassantPossible !== null) {
          if (chosenSide === Side.White && location[1] !== 3) {
            continue;
          }
          if (chosenSide === Side.Black && location[1] !== 4) {
            continue;
          }
        }


        allowedMoves.push([specificTargetLocation[0], specificTargetLocation[1]]);
        
      }

      break;

    case Piece.Knight:

      let canMoveKnight: boolean[] = [true, true, true, true];

      let KnightTotalDirectionalMovement: Location[] = [[0, 0], [0, 0]];

      let KnightSpecificDirectionalMovement: Location;

      for (let index = 0; index < 8; index++) {

        switch (index) {
          case 0:
            KnightTotalDirectionalMovement[index] = [location[0] + 1, location[1] + 2];
            break;
          
          case 1:
            KnightTotalDirectionalMovement[index] = [location[0] + 1, location[1] - 2];
            break;

          case 2:
            KnightTotalDirectionalMovement[index] = [location[0] - 1, location[1] + 2];
            break;

          case 3:
            KnightTotalDirectionalMovement[index] = [location[0] - 1, location[1] - 2];
            break;

          case 4:
            KnightTotalDirectionalMovement[index] = [location[0] + 2, location[1] + 1];
            break;
          
          case 5:
            KnightTotalDirectionalMovement[index] = [location[0] + 2, location[1] - 1];
            break;

          case 6:
            KnightTotalDirectionalMovement[index] = [location[0] - 2, location[1] + 1];
            break;

          case 7:
            KnightTotalDirectionalMovement[index] = [location[0] - 2, location[1] - 1];
            break;

          defeault:
            break;
          
        }

        KnightSpecificDirectionalMovement = KnightTotalDirectionalMovement[index];
        
        if (KnightSpecificDirectionalMovement[1] < 0 || KnightSpecificDirectionalMovement[1] > 7 || KnightSpecificDirectionalMovement[0] < 0 || KnightSpecificDirectionalMovement[0] > 7) {
          continue;
        }

        targetSidedPiece = board[KnightSpecificDirectionalMovement[1]][KnightSpecificDirectionalMovement[0]];

        if (targetSidedPiece === null) {
          allowedMoves.push([KnightSpecificDirectionalMovement[0], KnightSpecificDirectionalMovement[1]]);
        } else {
          targetSide = sidedPieceToSide(targetSidedPiece);
          if (chosenSide !== targetSide) {
            allowedMoves.push([KnightSpecificDirectionalMovement[0], KnightSpecificDirectionalMovement[1]]);
          }
        }
      }


      break;

    
    case Piece.Rook:

      let canMoveRook: boolean[] = [true, true, true, true];

      let RookTotalDirectionalMovement: Location[] = [[0, 0], [0, 0]];

      let RookSpecificDirectionalMovement: Location;

      for (let index = 0; index < 4; index++) {
        for (move = 1; move <= 8; move++) {

          switch (index) {
            case 0:
              RookTotalDirectionalMovement[index] = [location[0] + move, location[1]];
              break;
            
            case 1:
              RookTotalDirectionalMovement[index] = [location[0] - move, location[1]];
              break;

            case 2:
              RookTotalDirectionalMovement[index] = [location[0], location[1] + move];
              break;

            case 3:
              RookTotalDirectionalMovement[index] = [location[0], location[1] - move];
              break;

            defeault:
              break;
            
          }

          if (canMoveRook[index] === false) {
            continue;
          }

          RookSpecificDirectionalMovement = RookTotalDirectionalMovement[index];
          
          if (RookSpecificDirectionalMovement[1] < 0 || RookSpecificDirectionalMovement[1] > 7 || RookSpecificDirectionalMovement[0] < 0 || RookSpecificDirectionalMovement[0] > 7) {
            continue;
          }

          targetSidedPiece = board[RookSpecificDirectionalMovement[1]][RookSpecificDirectionalMovement[0]];

          if (targetSidedPiece === null) {
            allowedMoves.push([RookSpecificDirectionalMovement[0], RookSpecificDirectionalMovement[1]]);
          } else {
            targetSide = sidedPieceToSide(targetSidedPiece);
            canMoveRook[index] = false;
            if (chosenSide !== targetSide) {
              allowedMoves.push([RookSpecificDirectionalMovement[0], RookSpecificDirectionalMovement[1]]);
            }
          }
        }
      }


      break;

    case Piece.Bishop:

      let canMoveBishop: boolean[] = [true, true, true, true];

      let BishopTotalDirectionalMovement: Location[] = [[0, 0], [0, 0]];

      let BishopSpecificDirectionalMovement: Location;

      for (let index = 0; index < 4; index++) {
        for (move = 1; move <= 8; move++) {

          switch (index) {
            case 0:
              BishopTotalDirectionalMovement[index] = [location[0] + move, location[1] + move];
              break;
            
            case 1:
              BishopTotalDirectionalMovement[index] = [location[0] + move, location[1] - move];
              break;

            case 2:
              BishopTotalDirectionalMovement[index] = [location[0] - move, location[1] + move];
              break;

            case 3:
              BishopTotalDirectionalMovement[index] = [location[0] - move, location[1] - move];
              break;

            defeault:
              break;
            
          }

          if (canMoveBishop[index] === false) {
            continue;
          }

          BishopSpecificDirectionalMovement = BishopTotalDirectionalMovement[index];
          
          if (BishopSpecificDirectionalMovement[1] < 0 || BishopSpecificDirectionalMovement[1] > 7 || BishopSpecificDirectionalMovement[0] < 0 || BishopSpecificDirectionalMovement[0] > 7) {
            continue;
          }

          targetSidedPiece = board[BishopSpecificDirectionalMovement[1]][BishopSpecificDirectionalMovement[0]];

          if (targetSidedPiece === null) {
            allowedMoves.push([BishopSpecificDirectionalMovement[0], BishopSpecificDirectionalMovement[1]]);
          } else {
            targetSide = sidedPieceToSide(targetSidedPiece);
            canMoveBishop[index] = false;
            if (chosenSide !== targetSide) {
              allowedMoves.push([BishopSpecificDirectionalMovement[0], BishopSpecificDirectionalMovement[1]]);
            }
          }
        }
      }

    break;

    
    ////////////////////////////////// QUEEN ///////////////////////////////////
  case Piece.Queen:

    let canMoveQueen: boolean[] = [true, true, true, true, true, true, true, true];

    let QueenTotalDirectionalMovement: Location[] = [[0, 0], [0, 0]];

    let QueenSpecificDirectionalMovement: Location;

    for (let index = 0; index < 8; index++) {
      for (move = 1; move <= 8; move++) {

        switch (index) {
          case 0:
            QueenTotalDirectionalMovement[index] = [location[0], location[1] + move];
            break;
          
          case 1:
            QueenTotalDirectionalMovement[index] = [location[0], location[1] - move];
            break;

          case 2:
            QueenTotalDirectionalMovement[index] = [location[0] + move, location[1]];
            break;

          case 3:
            QueenTotalDirectionalMovement[index] = [location[0] - move, location[1]];
            break;

          case 4:
            QueenTotalDirectionalMovement[index] = [location[0] + move, location[1] + move];
            break;
          
          case 5:
            QueenTotalDirectionalMovement[index] = [location[0] + move, location[1] - move];
            break;

          case 6:
            QueenTotalDirectionalMovement[index] = [location[0] - move, location[1] + move];
            break;

          case 7:
            QueenTotalDirectionalMovement[index] = [location[0] - move, location[1] - move];
            break;

          defeault:
            break;
          
        }

        if (canMoveQueen[index] === false) {
          continue;
        }

        QueenSpecificDirectionalMovement = QueenTotalDirectionalMovement[index];
        
        if (QueenSpecificDirectionalMovement[1] < 0 || QueenSpecificDirectionalMovement[1] > 7 || QueenSpecificDirectionalMovement[0] < 0 || QueenSpecificDirectionalMovement[0] > 7) {
          continue;
        }

        targetSidedPiece = board[QueenSpecificDirectionalMovement[1]][QueenSpecificDirectionalMovement[0]];

        if (targetSidedPiece === null) {
          allowedMoves.push([QueenSpecificDirectionalMovement[0], QueenSpecificDirectionalMovement[1]]);
        } else {
          targetSide = sidedPieceToSide(targetSidedPiece);
          canMoveQueen[index] = false;
          if (chosenSide !== targetSide) {
            allowedMoves.push([QueenSpecificDirectionalMovement[0], QueenSpecificDirectionalMovement[1]]);
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

          if (isRecursed === false) {

            futureBoard = getBoardStateAfterMove(state, [location[0], location[1]], [specificTargetLocation[0], specificTargetLocation[1]]);

            if (isInCheck(futureBoard, chosenSide)) {
              continue;
            }

          }

          allowedMoves.push([specificTargetLocation[0], specificTargetLocation[1]]);
          
        }
        
      }

      // console.log("Castling:", state.castling.whiteQueenSide);
      // console.log(location[0], location[1]);

      if (chosenSide === Side.White) {
        if (state.castling.whiteKingSide === true && state.board[7][6] === null && state.board[7][5] === null) {
          allowedMoves.push([6, 7]);
        } 
        if (state.castling.whiteQueenSide === true && state.board[7][3] === null && state.board[7][2] === null && state.board[7][1] === null) {
          allowedMoves.push([2, 7]);
        }
      } else {
        if (state.castling.blackKingSide === true && state.board[0][6] === null && state.board[0][5] == null) {
          allowedMoves.push([6, 0]);
        }
        if (state.castling.blackQueenSide === true && state.board[0][3] === null && state.board[0][2] === null && state.board[0][1] === null) {
          allowedMoves.push([2, 0]);
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
    for (let move of getValidMoves(state, position, true)) {
      if (move[0] === kingPos[0] && move[1] === kingPos[1]) {
        return true;
      }
    }
  }

  return false;
}

export function getBoardStateAfterMove(state: ExtendedBoardState, from: Location, to: Location) {
  state = structuredClone(state);

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


  // promoting
  if (piece !== null && sidedPieceToPiece(piece) === Piece.Pawn) {
    const side = sidedPieceToSide(piece);
    if (side === Side.White && to[1] === 0) {
      state.board[to[1]][to[0]] = SidedPiece.WhiteQueen;
    }
    if (side === Side.Black && to[1] === 7) {
      state.board[to[1]][to[0]] = SidedPiece.BlackQueen;
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


  if (piece !== null && sidedPieceToSide(piece) === Side.Black) {
    state.fullMoves += 1;
  }

  state.active = invertSide(state.active);


  return state;
}

export function isGameOver(state: ExtendedBoardState): GameOver {
  let whiteHasMove = false;
  let blackHasMove = false;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = state.board[y][x];

      if (piece === null) {
        continue;
      }

      const pieceSide = sidedPieceToSide(piece);

      if (pieceSide === Side.White) {
        if (!whiteHasMove) {
          if (getValidMoves(state, [ x, y ]).length > 0) {
            whiteHasMove = true;
          }
        }
      } else {
        if (!blackHasMove) {
          if (getValidMoves(state, [ x, y ]).length > 0) {
            blackHasMove = true;
          }
        }
      }
    }
  }

  if (state.active === Side.White) {
    if (whiteHasMove) {
      return GameOver.No;
    }

    if (isInCheck(state, Side.White)) {
      return GameOver.BlackWin;
    }
    return GameOver.Draw;
  } else {
    if (blackHasMove) {
      return GameOver.No;
    }

    if (isInCheck(state, Side.Black)) {
      return GameOver.WhiteWin;
    }
    return GameOver.Draw;
  }
}
