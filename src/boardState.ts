import { BoardState, notationToSidedPieceMap, sidedPieceToNotationMap } from "./types.ts";

export function encodeBoardState(board: BoardState): string {
  return board
        .map(row => row
              .map(v => v === null ? " " : sidedPieceToNotationMap[v])
              .join(""))
        .join("/");
}

export function decodeBoardState(state: string): BoardState {
  return state.split("/").map(row => row
        .split("")
        .map(c => c === " " ? null : notationToSidedPieceMap[c]));
}
