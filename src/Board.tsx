import style from "./Board.module.scss";
import { Side } from "./types.ts";

interface Props {
  side: Side;
}

export default function Board({ side }: Props) {
  return <div className={style.board}>
    {Array(64)
          .fill(undefined)
          .map((_, i) => [ i % 8, Math.floor(i / 8) ])
          .map(i => <div
                key={i.join(",")}
                className={(i[0] + i[1]) % 2 !== side ? style.dark : undefined} />)}
  </div>;
}
