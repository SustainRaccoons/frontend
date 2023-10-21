import Board from "./Board.tsx";
import { GameType, Side } from "./types.ts";

interface Props {
  type: GameType;
  side: Side;
}

interface GameProps {
  side: Side;
}

export default function Game({ type, side }: Props) {
  switch (type) {
    case GameType.Local:
      return <LocalGame side={side} />;
  }
  return <>gaem? {type}</>;
}

function LocalGame({ side }: GameProps) {
  return <Board side={side} />;
}
