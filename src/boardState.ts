import { ExtendedBoardState, Location, notationToSidedPieceMap, Side, sidedPieceToNotationMap } from "./types.ts";

function locationToAlgebraic(loc: Location): string {
  return `${"abcdefgh"[loc[0]]}${8 - loc[1]}`;
}

function algebraicToLocation(alg: string): Location {
  return [
    alg[0].charCodeAt(0) - 97, // - 'a'
    8 - Number(alg[1]),
  ];
}

export function encodeBoardState(state: ExtendedBoardState): string {
  const placement = state.board
        .map(row => row
              .map(v => v === null ? " " : sidedPieceToNotationMap[v])
              .join(""))
        .join("/")
        .replace(/ +/g, substring => {
          return substring.length.toString(10);
        });

  const active = state.active === Side.White ? "w" : "b";

  const castling = (state.castling.whiteKingSide ? "K" : "") +
        (state.castling.whiteQueenSide ? "Q" : "") +
        (state.castling.blackKingSide ? "k" : "") +
        (state.castling.blackQueenSide ? "q" : "");

  const enPassant = state.enPassant === null ? "-" : locationToAlgebraic(state.enPassant);

  return `${placement} ${active} ${castling} ${enPassant} ${state.halfMoveClock} ${state.fullMoveClock}`;
}

export function decodeBoardState(state: string): ExtendedBoardState {
  const [
    placement,
    active,
    castling,
    enPassant,
    halfMoveClock,
    fullMoveClock,
  ] = state.split(" ");


  return {
    board: placement
          .replace(/\d/g, substring => " ".repeat(Number(substring)))
          .split("/")
          .map(row => row
                .split("")
                .map(c => c === " " ? null : notationToSidedPieceMap[c])),
    active: active === "w" ? Side.White : Side.Black,
    castling: {
      whiteKingSide: castling.includes("K"),
      whiteQueenSide: castling.includes("Q"),
      blackKingSide: castling.includes("k"),
      blackQueenSide: castling.includes("q"),
    },
    enPassant: enPassant === "-" ? null : algebraicToLocation(enPassant),
    halfMoveClock: Number(halfMoveClock),
    fullMoveClock: Number(fullMoveClock),
  };
}
