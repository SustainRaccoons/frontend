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
  requestMove: (from: Location, to: Location) => boolean;
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
    const piece = state[tileLoc[1]][tileLoc[0]];
    if (activePiece) {
      if (requestMove(activePiece, tileLoc)) {
        console.log("move success");
        setActivePiece(null);
        setValidMoves([]);
        return;
      } else console.log("move fail");

      if (piece === null ||
            sidedPieceToSide(piece) !== side ||
            (activePiece[0] === tileLoc[0] && activePiece[1] === activePiece[1])) {
        setActivePiece(null);
        setValidMoves([]);
        return;
      }
    }

    if (piece === null || sidedPieceToSide(piece) !== side) {
      return;
    }

    setActivePiece(tileLoc);
    setValidMoves(getValidMoves(state, tileLoc));
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
                        onMouseDown={tileSelectHandler(loc)}
                        onDragStart={() => console.log(1)}
                        draggable={true}
                  >
                    <img
                          src={p !== null ? pieces[p] : emptyTile}
                          alt={p !== null ? sidedPieceToNotationMap[p] : "empty"}
                          draggable={false} />
                  </div>)}
    </div>
    <button onClick={() => document.dispatchEvent(new Event("chess:swap"))}>Swap sides</button>
  </div>;
}
