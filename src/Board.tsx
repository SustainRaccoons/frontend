import classNames from "classnames";
import { useEffect, useState } from "react";
import { emptyTile, pieces } from "./assets.ts";
import style from "./Board.module.scss";
import { locationToAlgebraic } from "./boardState.ts";
import { getValidMoves, isInCheck } from "./boardUtils.ts";
import {
  BoardState,
  ExtendedBoardState,
  invertSide,
  Location,
  Piece,
  Side,
  SidedPiece,
  sidedPieceFromDetails,
  sidedPieceToNotationMap,
  sidedPieceToSide,
} from "./types.ts";

interface Props {
  side: Side;
  state: ExtendedBoardState;
  requestMove: (from: Location, to: Location) => boolean;
  locked: boolean;
}

function makeFlatBoard(state: BoardState, side: Side): [ SidedPiece | null, Location, Location ][] {
  const flatBoard: [ SidedPiece | null, Location, Location ][] = [];
  if (side === Side.White) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        flatBoard.push([ state[y][x], [ x, y ], [ x, y ] ]);
      }
    }
  } else {
    for (let y = 7; y >= 0; y--) {
      for (let x = 7; x >= 0; x--) {
        flatBoard.push([ state[y][x], [ x, y ], [ 7 - x, 7 - y ] ]);
      }
    }
  }

  return flatBoard;
}

function sameLoc(a: Location | null, b: Location | null): boolean {
  if (a === null || b === null) {
    return a === b;
  }
  return a[0] === b[0] && a[1] === b[1];
}

export default function Board({ side, state, requestMove, locked }: Props) {
  const [ activePiece, setActivePiece ] = useState<null | Location>(null);
  const [ validMoves, setValidMoves ] = useState<Location[]>([]);
  const [ dragging, setDragging ] = useState(false);
  const [ fullClick, setFullClick ] = useState(false);
  const [ ghostPos, setGhostPos ] = useState([ 0, 0 ]);
  const [ mouseOverTile, setMouseOverTile ] = useState<Location>([ 0, 0 ]);


  useEffect(() => {
    const mouseUpListener = () => setTimeout(() => setDragging(false));
    document.addEventListener("mouseup", mouseUpListener);

    return () => {
      document.removeEventListener("mouseup", mouseUpListener);
    };
  }, []);

  useEffect(() => {
    const mouseMoveListener = (e: any) => {
      if (e.buttons !== 1) {
        return;
      }

      if (activePiece && sameLoc(activePiece, mouseOverTile) && !dragging) {
        setDragging(true);
      }

      if (activePiece) {
        setGhostPos([ e.x, e.y ]);
      }
    };
    document.addEventListener("mousemove", mouseMoveListener);

    return () => {
      document.removeEventListener("mousemove", mouseMoveListener);
    };
  }, [ activePiece, dragging, mouseOverTile ]);


  const tileMouseDown = (tileLoc: Location) => () => {
    if (state.active !== side || locked) {
      return;
    }

    const piece = state.board[tileLoc[1]][tileLoc[0]];

    if (activePiece) {
      if (requestMove(activePiece, tileLoc)) {
        setActivePiece(null);
        setValidMoves([]);
        setFullClick(true);
        return;
      }
    }

    if (piece === null || sidedPieceToSide(piece) !== side) {
      return;
    }

    if (sameLoc(activePiece, tileLoc)) {
      return;
    }

    setActivePiece(tileLoc);
    setValidMoves(getValidMoves(state, tileLoc));
    setFullClick(false);
  };
  const tileMouseUp = (tileLoc: Location) => () => {
    if (!dragging) {
      if (sameLoc(activePiece, tileLoc)) {
        if (!fullClick) {
          setFullClick(true);
          return;
        }
      }
    } else {
      if (activePiece) {
        requestMove(activePiece, tileLoc);
      }
    }
    setActivePiece(null);
    setValidMoves([]);
    setFullClick(true);
  };


  return <div className={style.board}>
    {makeFlatBoard(state.board, side)
          .map(([ p, loc, realLoc ]) =>
                <div
                      key={locationToAlgebraic(loc)}
                      title={locationToAlgebraic(loc)}
                      className={classNames({
                        [style.dark]: (loc[0] + loc[1]) % 2 !== 0,
                        [style.active]: sameLoc(activePiece, loc),
                        [style.validMove]: validMoves.some((move) => sameLoc(loc, move)),
                        [style.drop]: dragging && sameLoc(mouseOverTile, loc) && validMoves.some((move) => sameLoc(loc, move)),
                        [style.drag]: sameLoc(activePiece, loc) && dragging,
                        [style.check]: (isInCheck(state, side) && p === sidedPieceFromDetails(side, Piece.King)) ||
                        (isInCheck(state, invertSide(side)) && p === sidedPieceFromDetails(invertSide(side), Piece.King)),
                      })}
                      onMouseDown={tileMouseDown(loc)}
                      onMouseUp={tileMouseUp(loc)}
                      onMouseEnter={() => setMouseOverTile(loc)}
                      draggable={false}
                >
                  {realLoc[0] === 7 ? <span className={style.rowName}>{8 - loc[1]}</span> : null}
                  {realLoc[1] === 7 ? <span className={style.colName}>{"ABCDEFGH"[loc[0]]}</span> : null}
                  <img
                        src={p !== null ? pieces[p] : emptyTile}
                        alt={p !== null ? sidedPieceToNotationMap[p] : "empty"}
                        draggable={false} />
                </div>)}
    {(activePiece && dragging) ? <img
          className={style.ghost}
          src={pieces[state.board[activePiece[1]][activePiece[0]]!]}
          alt={sidedPieceToNotationMap[state.board[activePiece[1]][activePiece[0]]!]}
          style={{ left: ghostPos[0], top: ghostPos[1] }}
          draggable={false}
    /> : null}
  </div>;
}
