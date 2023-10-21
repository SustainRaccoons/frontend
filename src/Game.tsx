import React, { useEffect, useState } from "react";
import style from "./App.module.scss";
import Board from "./Board.tsx";
import { getBoardStateAfterMove, isGameOver, isValidMove } from "./boardUtils.ts";
import {
  isEDInEffect,
  isSchizophreniaIfEffect,
  mentalIllnessList,
  movesSkippedByCripplingSelfDoubt,
  spacesSubtractedByDepression,
} from "./mentalIllnessUtils.ts";
import { ExtendedBoardState, GameOver, Location, Side } from "./types.ts";

interface Props {
  side: Side;
  boardState: ExtendedBoardState,
  setBoardState: React.Dispatch<React.SetStateAction<ExtendedBoardState>>,
}

export default function Game({ side, boardState, setBoardState }: Props) {
  const [ gameOver, setGameOver ] = useState(GameOver.No);
  const mentalIllnesses = mentalIllnessList(boardState.board, side === Side.White)
  const handleMoveRequest = (from: Location, to: Location) => {
    if (!isValidMove(boardState, from, to)) {
      return false;
    }

    const piece = boardState.board[from[1]][from[0]];
    if (piece === null) {
      return false;
    }

    setBoardState(state => {
      const boardStateAfterMove = getBoardStateAfterMove(state, from, to);

      document.dispatchEvent(new CustomEvent("chess:move", {
        detail: boardStateAfterMove.lastMove,
      }));

      return boardStateAfterMove;
    });
    return true;
  };

  useEffect(() => {
    setGameOver(isGameOver(boardState));
  }, [ boardState ]);

  const pointsMarker = (points: number) => {
    return new Array(points).fill(0).map(() => <div></div>)
  }

  const illnessPoints = (name: string, points: number, effectText: string) => (
      <div className={style.illness}>
        <div>
          <p>{name}</p>
          <p>{effectText}</p>
        </div>
        <div>{pointsMarker(points)}</div>
      </div>
  )

  return <div className={style.game}>
    <Board side={side} state={boardState} requestMove={handleMoveRequest} locked={gameOver !== GameOver.No} />

    {mentalIllnesses.cripplingSelfDoubt > 0 && illnessPoints("Crippling self doubt", mentalIllnesses.cripplingSelfDoubt, `${movesSkippedByCripplingSelfDoubt(mentalIllnesses)} moves`)}
    {mentalIllnesses.schizophrenia > 0 && illnessPoints("Schizophrenia", mentalIllnesses.schizophrenia, `${isSchizophreniaIfEffect(boardState, mentalIllnesses)} moves`)}
    {mentalIllnesses.eatingDisorder > 0 && illnessPoints("Eating disorder", mentalIllnesses.eatingDisorder, `${isEDInEffect(boardState, mentalIllnesses)} moves`)}
    {mentalIllnesses.anxiety > 0 && illnessPoints("Anxiety", mentalIllnesses.anxiety, "")}
    {mentalIllnesses.depression > 0 && illnessPoints("Depression", mentalIllnesses.depression, `${spacesSubtractedByDepression(mentalIllnesses)} spaces`)}

    <button onClick={() => document.dispatchEvent(new Event("chess:swap"))}>Swap sides</button>

    <span>Current move: {boardState.active === Side.White ? "white" : "black"}</span>
    <button onClick={() => document.dispatchEvent(new Event("chess:skip"))}>Toggle move</button>

    {gameOver !== GameOver.No ? <div>
      Game is over:{" "}
      {gameOver === GameOver.Draw ? "Draw" : null}
      {gameOver === GameOver.WhiteWin ? "White Won" : null}
      {gameOver === GameOver.BlackWin ? "Black Won" : null}
    </div> : null}
  </div>;
}
