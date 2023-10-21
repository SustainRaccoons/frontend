import style from "./Board.module.scss";
import { BoardState, Side, sidedPieceToNotationMap } from "./types.ts";

interface Props {
  side: Side;
  state: BoardState;
}

export default function Board({ side, state }: Props) {
  return <div className={style.board}>
    {state
          .flatMap((row, y) =>
                row.map((p, x) =>
                      <div
                            key={`${x}:${y}`}
                            className={(x + y) % 2 !== side ? style.dark : undefined}>
                        {p !== null ? sidedPieceToNotationMap[p] : null}
                      </div>))}
  </div>;
}
