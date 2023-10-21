import classNames from "classnames";
import { useState } from "react";
import style from "./Board.module.scss";
import { locationToAlgebraic } from "./boardState.ts";
import { getValidMoves } from "./boardUtils.ts";
import { BoardState, Location, Side, SidedPiece, sidedPieceToNotationMap, sidedPieceToSide } from "./types.ts";

interface Props {
  side: Side;
  state: BoardState;
  requestMove: (from: Location, to: Location) => any;
}

function augmentState(state: BoardState, side: Side) {
  let augmentedState = state
        .map((row, y) => [ row, y ] as [ (SidedPiece | null)[], number ]);
  // augmentedState = (side === Side.White ? augmentedState : augmentedState.reverse())
  if (side === Side.Black) {
    augmentedState.reverse();
  }

  console.log(augmentedState);

  return augmentedState;
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

  return <div className={style.board}>
    {augmentState(state, side)
          .flatMap(([ row, y ]) =>
                row.map((p, x) =>
                      <div
                            key={locationToAlgebraic([ x, y ])}
                            title={locationToAlgebraic([ x, y ])}
                            className={classNames({
                              [style.dark]: (x + y) % 2 !== 0,
                              [style.active]: activePiece !== null && (activePiece[0] === x && activePiece[1] === y),
                              [style.validMove]: validMoves.some(([ mx, my ]) => mx === x && my === y),
                            })}
                            onClick={tileSelectHandler([ x, y ])}>
                        {p !== null ? sidedPieceToNotationMap[p] : null}
                      </div>))}
  </div>;
}
