import { useState } from "react";
import Board from "./Board.tsx";
import { isValidMove } from "./boardUtils.ts";
import makeDefaultBoard from "./defaultBoardState.ts";
import { BoardState, GameType, Location, Side } from "./types.ts";

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
  const [ boardState, setBoardState ] = useState<BoardState>(makeDefaultBoard());

  const handleMoveRequest = (from: Location, to: Location) => {
    if (!isValidMove(boardState, from, to)) {
      return;
    }

    setBoardState(board => {
      if (board[to[1]][to[0]] !== null) {
        console.log("takes");
      }

      const piece = board[from[1]][from[0]];
      board[from[1]][from[0]] = null;

      board[to[1]][to[0]] = piece;

      return [ ...board ];
    });
  };

  return <Board side={side} state={boardState} requestMove={handleMoveRequest} />;
}
