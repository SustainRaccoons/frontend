import classNames from "classnames";
import { useState } from "react";
import { emptyTile, pieces } from "./assets.ts";
import style from "./Board.module.scss";
import { locationToAlgebraic } from "./boardState.ts";
import { getValidMoves } from "./boardUtils.ts";
import { BoardState, Location, Side, SidedPiece, sidedPieceToNotationMap, sidedPieceToSide } from "./types.ts";

interface Props {
  side: Side;
  state: BoardState;
  requestMove: (from: Location, to: Location) => any;
}

function makeFlatBoard(state: BoardState, side: Side): [ SidedPiece | null, Location ][] {
  const flatBoard: [ SidedPiece | null, Location ][] = [];
  if (side === Side.White) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        flatBoard.push([ state[y][x], [ x, y ] ]);
      }
    }
  } else {
    for (let y = 7; y >= 0; y--) {
      for (let x = 7; x >= 0; x--) {
        flatBoard.push([ state[y][x], [ x, y ] ]);
      }
    }
  }

  return flatBoard;
}

export default function Board({ side, state, requestMove }: Props) {
  const [ activePiece, setActivePiece ] = useState<null | Location>(null);
  const [ validMoves, setValidMoves ] = useState<Location[]>([]);

  const tileSelectHandler = (tileLoc: Location) => () => {
    if (activePiece) {
      requestMove(activePiece, tileLoc);
      setActivePiece(null);
      setValidMoves([]);
    } else {
      const piece = state[tileLoc[1]][tileLoc[0]];

      if (piece === null) {
        return;
      }

      if (sidedPieceToSide(piece) !== side) {
        return;
      }

      setActivePiece(tileLoc);
      setValidMoves(getValidMoves(state, tileLoc));
    }
  };

  return <div>
    <div className={style.board}>
      {makeFlatBoard(state, side)
            .map(([ p, loc ]) =>
                  <div
                        key={locationToAlgebraic(loc)}
                        title={locationToAlgebraic(loc)}
                        className={classNames({
                          [style.dark]: (loc[0] + loc[1]) % 2 !== 0,
                          [style.active]: activePiece !== null && (activePiece[0] === loc[0] && activePiece[1] === loc[1]),
                          [style.validMove]: validMoves.some(([ mx, my ]) => mx === loc[0] && my === loc[1]),
                        })}
                        onClick={tileSelectHandler(loc)}>
                    <img
                          src={p !== null ? pieces[p] : emptyTile}
                          alt={p !== null ? sidedPieceToNotationMap[p] : "empty"} />
                  </div>)}
    </div>
    <button onClick={() => document.dispatchEvent(new Event("chess:swap"))}>Swap sides</button>
  </div>;
}
