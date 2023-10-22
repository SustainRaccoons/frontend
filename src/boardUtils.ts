import {locationToAlgebraic} from "./boardState.ts";
import {
  ExtendedBoardState,
  ExtraExtendedBoardState,
  GameOver,
  invertSide,
  Location,
  MentalIllnessList,
  Piece,
  Side,
  SidedPiece,
  sidedPieceToPiece,
  sidedPieceToSide,
  sidedPieceToSymbolMap,
} from "./types.ts";
import {
  isEDInEffect,
  isSchizophreniaIfEffect,
  mentalIllnessList,
  spacesSubtractedByDepression
} from "./mentalIllnessUtils.ts";

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
  let willBeInCheck: boolean = false;

  let isWhite: boolean = false;
  if (chosenSide === Side.White) {
    isWhite = true;
  }
  let currentMentalIllnesses: MentalIllnessList = mentalIllnessList(board, isWhite);

  let isSchizo: number | boolean = isSchizophreniaIfEffect(state, currentMentalIllnesses);

  let isEatingDisorder: number | boolean = isEDInEffect(state, currentMentalIllnesses);

  let depressionPoints: number = spacesSubtractedByDepression(currentMentalIllnesses);


  switch (chosenPiece) {
    case Piece.Pawn:

    let canMovePawn: boolean[] = [true, true, true, true, true, true];

    let PawnTotalDirectionalMovement: Location[] = [[0, 0], [0, 0]];

    let PawnSpecificDirectionalMovement: Location;

    let enPassantPossible: null | Location = state.enPassant;

    let fieldAbovePawnWhenMovingDouble: null | SidedPiece;

    for (let index = 0; index < 8; index++) {

      switch (index) {
        case 0:
          PawnTotalDirectionalMovement[index] = [location[0] + 1, location[1] + 1];
          break;
        
        case 1:
          PawnTotalDirectionalMovement[index] = [location[0], location[1] + 1];
          break;

        case 2:
          PawnTotalDirectionalMovement[index] = [location[0] - 1, location[1] + 1];
          break;

        case 3:
          PawnTotalDirectionalMovement[index] = [location[0], location[1] + 2];
          break;

        case 4:
          PawnTotalDirectionalMovement[index] = [location[0] + 1, location[1] - 1];
          break;
        
        case 5:
          PawnTotalDirectionalMovement[index] = [location[0], location[1] - 1];
          break;

        case 6:
          PawnTotalDirectionalMovement[index] = [location[0] - 1, location[1] - 1];
          break;
        
        case 7:
          PawnTotalDirectionalMovement[index] = [location[0], location[1] - 2];
          break;
  
        break;
        
      }

      PawnSpecificDirectionalMovement = PawnTotalDirectionalMovement[index];
      
      if (PawnSpecificDirectionalMovement[1] < 0 || PawnSpecificDirectionalMovement[1] > 7 || PawnSpecificDirectionalMovement[0] < 0 || PawnSpecificDirectionalMovement[0] > 7) {
        continue;
      }

      targetSidedPiece = board[PawnSpecificDirectionalMovement[1]][PawnSpecificDirectionalMovement[0]];

      if (isRecursed === false) {
        futureBoard = getBoardStateAfterMove(state, [location[0], location[1]], [PawnSpecificDirectionalMovement[0], PawnSpecificDirectionalMovement[1]]);

        if (isInCheck(futureBoard, chosenSide)) {
          continue;
        }
      }

      if (targetSidedPiece !== null) {
        targetSide = sidedPieceToSide(targetSidedPiece);
      }

      if (index >= 0 && index <= 3 && chosenSide === Side.White) {
        continue;
      }

      if (index >= 4 && index <= 7 && chosenSide === Side.Black) {
        continue;
      }

      if (PawnSpecificDirectionalMovement[1] - 1 < 0) {
        continue;
      }

      fieldAbovePawnWhenMovingDouble = board[PawnSpecificDirectionalMovement[1] - 1][PawnSpecificDirectionalMovement[0]];

      if (index == 3 && location[1] !== 1) {
        continue;
      }

      if (index == 3 && fieldAbovePawnWhenMovingDouble !== null) {
        continue;
      }

      if (index == 7 && location[1] !== 6) {
        continue;
      }

      if (PawnSpecificDirectionalMovement[1] + 1 > 7) {
        continue;
      }
      
      fieldAbovePawnWhenMovingDouble = board[PawnSpecificDirectionalMovement[1] + 1][PawnSpecificDirectionalMovement[0]];

      if (index == 7 && fieldAbovePawnWhenMovingDouble !== null) {
        continue;
      }

      if ((index == 0 || index == 2 || index == 4 || index == 6) && enPassantPossible !== null && isEatingDisorder !== 0) {

        if (enPassantPossible[0] == PawnSpecificDirectionalMovement[0] && enPassantPossible[1] == PawnSpecificDirectionalMovement[1]) {

          if (chosenSide === Side.White && location[1] !== 3) {
            continue;
          } else if (chosenSide === Side.Black && location[1] !== 4) {
            continue;
          }


          allowedMoves.push([PawnSpecificDirectionalMovement[0], PawnSpecificDirectionalMovement[1]]);
          continue;
        }

      }

      if (isSchizo !== 0 && targetSidedPiece === null && (index == 1 || index == 3 || index == 5 || index == 7)) {
        allowedMoves.push([PawnSpecificDirectionalMovement[0], PawnSpecificDirectionalMovement[1]]);
        continue;
      }

      if (targetSidedPiece !== null) {
        targetSide = sidedPieceToSide(targetSidedPiece);

        if (isEatingDisorder === 0) {
          continue;
        }

        if (targetSide == Side.White && (index == 0 || index == 2)) {
          allowedMoves.push([PawnSpecificDirectionalMovement[0], PawnSpecificDirectionalMovement[1]]);
        } else if (targetSide == Side.Black && (index == 4 || index == 6)) {
          allowedMoves.push([PawnSpecificDirectionalMovement[0], PawnSpecificDirectionalMovement[1]]);
        }
      }


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

          break;
          
        }

        KnightSpecificDirectionalMovement = KnightTotalDirectionalMovement[index];
        
        if (KnightSpecificDirectionalMovement[1] < 0 || KnightSpecificDirectionalMovement[1] > 7 || KnightSpecificDirectionalMovement[0] < 0 || KnightSpecificDirectionalMovement[0] > 7) {
          continue;
        }

        targetSidedPiece = board[KnightSpecificDirectionalMovement[1]][KnightSpecificDirectionalMovement[0]];

        if (isRecursed === false) {
          futureBoard = getBoardStateAfterMove(state, [location[0], location[1]], [KnightSpecificDirectionalMovement[0], KnightSpecificDirectionalMovement[1]]);

          if (isInCheck(futureBoard, chosenSide)) {
            continue;
          }
        }

        if (targetSidedPiece === null) {
          if (isSchizo !== 0) {
            allowedMoves.push([KnightSpecificDirectionalMovement[0], KnightSpecificDirectionalMovement[1]]);
          }
        } else {
          targetSide = sidedPieceToSide(targetSidedPiece);
          if (chosenSide !== targetSide && isEatingDisorder !== 0) {
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
        for (move = 1; move <= 8 - depressionPoints; move++) {

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

          if (isRecursed === false) {
            futureBoard = getBoardStateAfterMove(state, [location[0], location[1]], [RookSpecificDirectionalMovement[0], RookSpecificDirectionalMovement[1]]);
  
            if (isInCheck(futureBoard, chosenSide)) {
              if (targetSidedPiece !== null) {
                canMoveRook[index] = false;
              }
              continue;
            }
          }
  
          if (targetSidedPiece === null) {
            if (isSchizo !== 0) {
              allowedMoves.push([RookSpecificDirectionalMovement[0], RookSpecificDirectionalMovement[1]]);
            }
          } else {
            targetSide = sidedPieceToSide(targetSidedPiece);
            canMoveRook[index] = false;
            if (chosenSide !== targetSide && isEatingDisorder !== 0) {
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
        for (move = 1; move <= 8 - depressionPoints; move++) {

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

          if (isRecursed === false) {
            futureBoard = getBoardStateAfterMove(state, [location[0], location[1]], [BishopSpecificDirectionalMovement[0], BishopSpecificDirectionalMovement[1]]);
  
            if (isInCheck(futureBoard, chosenSide)) {
              if (targetSidedPiece !== null) {
                canMoveBishop[index] = false;
              }
              continue;
            }
          }
  
          if (targetSidedPiece === null) {
            if (isSchizo !== 0) {
              allowedMoves.push([BishopSpecificDirectionalMovement[0], BishopSpecificDirectionalMovement[1]]);
            }
          } else {
            targetSide = sidedPieceToSide(targetSidedPiece);
            canMoveBishop[index] = false;
            if (chosenSide !== targetSide && isEatingDisorder !== 0) {
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
      for (move = 1; move <= 8 - depressionPoints; move++) {

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

        if (isRecursed === false) {
          futureBoard = getBoardStateAfterMove(state, [location[0], location[1]], [QueenSpecificDirectionalMovement[0], QueenSpecificDirectionalMovement[1]]);

          if (isInCheck(futureBoard, chosenSide)) {
            if (targetSidedPiece !== null) {
              canMoveQueen[index] = false;
            }
            continue;
          }
        }

        if (targetSidedPiece === null) {
          if (isSchizo !== 0) {
            allowedMoves.push([QueenSpecificDirectionalMovement[0], QueenSpecificDirectionalMovement[1]]);
          }
        } else {
          targetSide = sidedPieceToSide(targetSidedPiece);
          canMoveQueen[index] = false;
          if (chosenSide !== targetSide && isEatingDisorder !== 0) {
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

            allowedMoves.push([specificTargetLocation[0], specificTargetLocation[1]]);
            continue;
          }

          if (isRecursed === false) {

            futureBoard = getBoardStateAfterMove(state, [location[0], location[1]], [specificTargetLocation[0], specificTargetLocation[1]]);

            if (isInCheck(futureBoard, chosenSide)) {
              continue;
            }

          }

          if (isSchizo !== 0) {
            allowedMoves.push([specificTargetLocation[0], specificTargetLocation[1]]);
          }
          
        }
        
      }

      // Castling

      if (isSchizo === 0) {
        break;
      }
      
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

export function getBoardStateAfterMove(startState: ExtendedBoardState, from: Location, to: Location): ExtraExtendedBoardState {
  const state = structuredClone(startState) as ExtraExtendedBoardState;

  const piece = state.board[from[1]][from[0]];
  const destination = state.board[to[1]][to[0]];

  if (piece === null) {
    state.lastMove = "-";
    return state;
  }

  const pieceSide = sidedPieceToSide(piece);
  const pieceType = sidedPieceToPiece(piece);

  const takenPiece = state.board[to[1]][to[0]];


  let disambiguation = "";
  if (pieceType !== Piece.Pawn) {
    for (let x = 0; x < 8; x++) {
      if (x === from[0]) {
        continue;
      }

      const lPiece = state.board[from[1]][x];
      if (lPiece === piece) {
        const availableMoves = getValidMoves(state, [ x, from[1] ], true);
        if (availableMoves.some(loc => loc[0] === to[0] && loc[1] == to[1])) {
          disambiguation += "abcdefgh"[from[0]];
          break;
        }
      }
    }
    for (let y = 0; y < 8; y++) {
      if (y === from[1]) {
        continue;
      }

      const lPiece = state.board[y][from[0]];
      if (lPiece === piece) {
        const availableMoves = getValidMoves(state, [ from[0], y ], true);
        if (availableMoves.some(loc => loc[0] === to[0] && loc[1] == to[1])) {
          disambiguation += "87654321"[from[1]];
          break;
        }
      }
    }
  }

  state.lastMove = sidedPieceToSymbolMap[piece] +
        disambiguation +
        (destination === null ? "" : "x") +
        locationToAlgebraic(to);


  state.board[from[1]][from[0]] = null;
  state.board[to[1]][to[0]] = piece;


  // en passant
  if (pieceType === Piece.Pawn) {
    const direction = from[1] - to[1];
    const didTake = from[0] != to[0];

    if (didTake && destination === null) {
      state.board[to[1] + direction][to[0]] = null;
      state.lastMove = "x" + locationToAlgebraic(to);
    }

    if (didTake) {
      state.lastMove = "abcdefgh"[from[0]] + state.lastMove;
    }
  }

  // castling
  if (pieceType === Piece.King && Math.abs(from[0] - to[0]) > 1) {
    const direction = from[0] - to[0];
    if (direction > 0) { // queen side
      const rook = state.board[to[1]][0];
      state.board[to[1]][0] = null;
      state.board[to[1]][3] = rook;
      state.lastMove = "O-O-O";
    }
    if (direction < 0) { // king side
      const rook = state.board[to[1]][7];
      state.board[to[1]][7] = null;
      state.board[to[1]][5] = rook;
      state.lastMove = "O-O";
    }
  }


  // promoting
  if (pieceType === Piece.Pawn) {
    if (pieceSide === Side.White && to[1] === 0) {
      state.board[to[1]][to[0]] = SidedPiece.WhiteQueen;
      state.lastMove += "=" + sidedPieceToSymbolMap[SidedPiece.WhiteQueen];
    }
    if (pieceSide === Side.Black && to[1] === 7) {
      state.board[to[1]][to[0]] = SidedPiece.BlackQueen;
      state.lastMove += "=" + sidedPieceToSymbolMap[SidedPiece.BlackQueen];
    }
  }


  // en passant availability
  if (pieceType === Piece.Pawn && Math.abs(from[1] - to[1]) === 2) {
    state.enPassant = [ from[0], (from[1] + to[1]) / 2 ];
  } else {
    state.enPassant = null;
  }

  // castling availability
  if (pieceType === Piece.Rook) {
    if (from[0] === 0) {
      if (pieceSide === Side.White && from[1] === 7) {
        state.castling.whiteQueenSide = false;
      }
      if (pieceSide === Side.Black && from[1] === 0) {
        state.castling.blackQueenSide = false;
      }
    }
    if (from[0] === 7) {
      if (pieceSide === Side.White && from[1] === 7) {
        state.castling.whiteKingSide = false;
      }
      if (pieceSide === Side.Black && from[1] === 0) {
        state.castling.blackKingSide = false;
      }
    }
  }
  if (takenPiece !== null && sidedPieceToPiece(takenPiece) === Piece.Rook) {
    if (to[0] === 0) {
      if (pieceSide === Side.White && to[1] === 7) {
        state.castling.whiteQueenSide = false;
      }
      if (pieceSide === Side.Black && to[1] === 0) {
        state.castling.blackQueenSide = false;
      }
    }
    if (to[0] === 7) {
      if (pieceSide === Side.White && to[1] === 7) {
        state.castling.whiteKingSide = false;
      }
      if (pieceSide === Side.Black && to[1] === 0) {
        state.castling.blackKingSide = false;
      }
    }
  }
  if (pieceType === Piece.King) {
    if (pieceSide === Side.White) {
      state.castling.whiteQueenSide = false;
      state.castling.whiteKingSide = false;
    }
    if (pieceSide === Side.Black) {
      state.castling.blackQueenSide = false;
      state.castling.blackKingSide = false;
    }
  }


  // did move check
  if (isInCheck(state, invertSide(pieceSide))) {
    state.lastMove += "+";
  }


  if (sidedPieceToSide(piece) === Side.Black) {
    state.fullMoves += 1;
  }

  state.active = invertSide(state.active);

  state.lastMoveTime = Date.now();

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
