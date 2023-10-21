import classNames from "classnames";
import { useState } from "react";
import style from "./Board.module.scss";
import { getValidMoves } from "./boardUtils.ts";
import { BoardState, Location, Side, sidedPieceToNotationMap } from "./types.ts";

interface Props {
  side: Side;
  state: BoardState;
  requestMove: (from: Location, to: Location) => any;
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
      setActivePiece(tileLoc);
      setValidMoves(getValidMoves(state, tileLoc));
    }
  };

  return <div className={style.board}>
    {state
          .flatMap((row, y) =>
                row.map((p, x) =>
                      <div
                            key={`${x}:${y}`}
                            className={classNames({
                              [style.dark]: (x + y) % 2 !== side,
                              [style.active]: activePiece !== null && (activePiece[0] === x && activePiece[1] === y),
                              [style.validMove]: validMoves.some(([ mx, my ]) => mx === x && my === y),
                            })}
                            onMouseDown={tileSelectHandler([ x, y ])}>
                        {p !== null ? sidedPieceToNotationMap[p] : null}
                      </div>))}
  </div>;
}
