import { BoardState, ExtendedBoardState, MentalIllnessList, Piece, Side, sidedPieceToPiece, sidedPieceToSide } from "./types.ts";

export const mentalIllnessList = (board: BoardState, isWhite: boolean): MentalIllnessList => {
  const mentalIllnessList: MentalIllnessList = {
    depression: 0,
    eatingDisorder: 0,
    anxiety: 0,
    schizophrenia: 0,
    cripplingSelfDoubt: 0,
  }

  const blackPieces = {
    pawn: 0,
    rook: 0,
    knight: 0,
    bishop: 0,
    queen: 0,
  }

  const whitePieces = {
    pawn: 0,
    rook: 0,
    knight: 0,
    bishop: 0,
    queen: 0,
  }

  for (const row of board) {
    for (const sq of row) {
      if (sq !== null) {
        const piece = sidedPieceToPiece(sq)
        const side = sidedPieceToSide(sq)
        if (side === Side.White) {
          switch (piece) {
            case Piece.Bishop:
              whitePieces.bishop++
              break
            case Piece.Knight:
              whitePieces.knight++
              break
            case Piece.Rook:
              whitePieces.rook++
              break
            case Piece.Pawn:
              whitePieces.pawn++
              break
            case Piece.Queen:
              whitePieces.queen++
              break
          }
        } else {
          switch (piece) {
            case Piece.Bishop:
              blackPieces.bishop++
              break
            case Piece.Knight:
              blackPieces.knight++
              break
            case Piece.Rook:
              blackPieces.rook++
              break
            case Piece.Pawn:
              blackPieces.pawn++
              break
            case Piece.Queen:
              blackPieces.queen++
              break
          }
        }
      }
    }
  }

  if (isWhite) {
    mentalIllnessList.anxiety = blackPieces.knight - whitePieces.knight
    mentalIllnessList.eatingDisorder = blackPieces.rook - whitePieces.rook
    mentalIllnessList.schizophrenia = blackPieces.bishop - whitePieces.bishop
    mentalIllnessList.depression = blackPieces.pawn - whitePieces.pawn
    mentalIllnessList.cripplingSelfDoubt = blackPieces.queen - whitePieces.queen
  } else {
    mentalIllnessList.anxiety = whitePieces.knight - blackPieces.knight
    mentalIllnessList.eatingDisorder = whitePieces.rook - blackPieces.rook
    mentalIllnessList.schizophrenia = whitePieces.bishop - blackPieces.bishop
    mentalIllnessList.depression = whitePieces.pawn - blackPieces.pawn
    mentalIllnessList.cripplingSelfDoubt = whitePieces.queen - blackPieces.queen
  }

  return mentalIllnessList
}

export const isSchizophreniaIfEffect = (extendedBoard: ExtendedBoardState, mentalIllnessList: MentalIllnessList): number | false => {
  return mentalIllnessList.schizophrenia > 0 ? ((16 / 2**mentalIllnessList.schizophrenia) - 1) - (extendedBoard.fullMoves % (16 / 2**mentalIllnessList.schizophrenia)) : false
}

export const isEDInEffect = (extendedBoard: ExtendedBoardState, mentalIllnessList: MentalIllnessList): number | false => {
  return mentalIllnessList.eatingDisorder > 0 ? extendedBoard.fullMoves % (2**mentalIllnessList.eatingDisorder) : false
}

export const movesSkippedByCripplingSelfDoubt = (mentalIllnessList: MentalIllnessList): number | false => {
  return mentalIllnessList.cripplingSelfDoubt > 0 ? 2 ** (mentalIllnessList.cripplingSelfDoubt) : false;
}

export const spacesSubtractedByDepression = (mentalIllnessList: MentalIllnessList): number  => {
  return mentalIllnessList.depression
}

export const maxTimePerMoveFromAnxiety = (mentalIllnessList: MentalIllnessList): number | false => {
  return mentalIllnessList.anxiety > 0 ? 60 / (2**mentalIllnessList.anxiety) : false
}
