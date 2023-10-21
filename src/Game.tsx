import React, { useEffect, useState } from "react";
import style from "./App.module.scss";
import Board from "./Board.tsx";
import { getBoardStateAfterMove, isGameOver, isValidMove } from "./boardUtils.ts";
import {
  isEDInEffect,
  isSchizophreniaIfEffect,
  maxTimePerMoveFromAnxiety,
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
  const [ timerTime, setTimerTime ] = useState(0);

  const mentalIllnesses = mentalIllnessList(boardState.board, side === Side.White);
  const timerValue = maxTimePerMoveFromAnxiety(mentalIllnesses);

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
    let timer: number | undefined;
    if (side === boardState.active && timerValue !== false) {
      const turnEndTime = Date.now() + timerValue * 1000;

      setTimerTime(Math.round((turnEndTime - Date.now()) / 1000));
      timer = setInterval(() => {
        setTimerTime(Math.round((turnEndTime - Date.now()) / 1000));
        if (Date.now() > turnEndTime) {
          document.dispatchEvent(new Event("chess:skip"));
          setTimerTime(0);
        }
      }, 1000);
    }

    setGameOver(isGameOver(boardState));

    return () => {
      clearInterval(timer);
    };
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
    {gameOver !== GameOver.No ? <h1>
      Game is over:{" "}
      {gameOver === GameOver.Draw ? "Draw" : null}
      {gameOver === GameOver.WhiteWin ? "White Won" : null}
      {gameOver === GameOver.BlackWin ? "Black Won" : null}
    </h1> : null}
    <h2>Current move: {boardState.active === Side.White ? "white" : "black"}</h2>

    <Board side={side} state={boardState} requestMove={handleMoveRequest} locked={gameOver !== GameOver.No} />

    {mentalIllnesses.cripplingSelfDoubt > 0 && illnessPoints("Crippling self doubt", mentalIllnesses.cripplingSelfDoubt, `${movesSkippedByCripplingSelfDoubt(mentalIllnesses)} moves`)}
    {mentalIllnesses.schizophrenia > 0 && illnessPoints("Schizophrenia", mentalIllnesses.schizophrenia, `${isSchizophreniaIfEffect(boardState, mentalIllnesses)} moves`)}
    {mentalIllnesses.eatingDisorder > 0 && illnessPoints("Eating disorder", mentalIllnesses.eatingDisorder, `${isEDInEffect(boardState, mentalIllnesses)} moves`)}
    {mentalIllnesses.anxiety > 0 && illnessPoints("Anxiety", mentalIllnesses.anxiety, `${maxTimePerMoveFromAnxiety(mentalIllnesses)} seconds`)}
    {mentalIllnesses.depression > 0 && illnessPoints("Depression", mentalIllnesses.depression, `${spacesSubtractedByDepression(mentalIllnesses)} spaces`)}

    <button onClick={() => document.dispatchEvent(new Event("chess:swap"))}>Swap sides</button>

    <span>Current move: {boardState.active === Side.White ? "white" : "black"}</span>
    <button onClick={() => document.dispatchEvent(new Event("chess:skip"))}>Toggle move</button>

    {timerValue !== false ? <div>
      0:{timerTime.toString(10).padStart(2, "0")}
    </div> : null}
  </div>;
}
