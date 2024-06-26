import React, {useEffect, useState} from "react";
import style from "./App.module.scss";
import Board from "./Board.tsx";
import {getBoardStateAfterMove, isGameOver, isValidMove} from "./boardUtils.ts";
import {
  isEDInEffect,
  isSchizophreniaIfEffect,
  maxTimePerMoveFromAnxiety,
  mentalIllnessList,
  movesSkippedByCripplingSelfDoubt,
  spacesSubtractedByDepression,
} from "./mentalIllnessUtils.ts";
import {ExtendedBoardState, GameOver, Location, Side} from "./types.ts";

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
    const mentalIllnesses = mentalIllnessList(boardState.board, side === Side.White);
    const timerValue = maxTimePerMoveFromAnxiety(mentalIllnesses);

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

    if (boardState.active !== side) {
      const selfDoubt = movesSkippedByCripplingSelfDoubt(mentalIllnessList(boardState.board, side !== Side.White));

      if (selfDoubt !== false) {
        if ((boardState.fullMoves % selfDoubt) !== 0) {
          document.dispatchEvent(new Event("chess:skip"));
        }
      }
    }

    let isOver = isGameOver(boardState);
    if (isOver === GameOver.Draw && isSchizophreniaIfEffect(boardState, mentalIllnessList(boardState.board, side !== Side.White)) === 0) {
      isOver = GameOver.No;
      document.dispatchEvent(new Event("chess:skip"));
    }
    setGameOver(isOver);

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
    <div className={style.topBar}>
      <h2><span style={{background: boardState.active === Side.White ? "#ffffff" : "#000000"}}></span> Current move: {boardState.active === Side.White ? "white" : "black"}</h2>
      {mentalIllnesses.anxiety > 0 && boardState.active === side && <p style={{position: "relative"}}><span style={{
        width: `${((60 / (2**mentalIllnesses.anxiety))/100) * timerTime}%`,
        background: "#AEAEAE",
        height: "100%",
        position: "absolute",
        left: "0",
        top: "0",
        zIndex: "-1"
      }}></span>Time to move: {timerTime.toString(10).padStart(2, "0")}s</p>}
      {mentalIllnesses.schizophrenia > 0 && boardState.active === side && isSchizophreniaIfEffect(boardState, mentalIllnesses) === 0 && <p>You are forced to take</p>}
      {mentalIllnesses.eatingDisorder > 0 && boardState.active === side && isEDInEffect(boardState, mentalIllnesses) === 0 && <p>You cannot take on this move</p>}
    </div>

    <Board side={side} state={boardState} requestMove={handleMoveRequest} locked={gameOver !== GameOver.No} />

    {mentalIllnesses.cripplingSelfDoubt > 0 && illnessPoints("Crippling self doubt", mentalIllnesses.cripplingSelfDoubt, `${movesSkippedByCripplingSelfDoubt(mentalIllnesses)} moves`)}
    {mentalIllnesses.schizophrenia > 0 && illnessPoints("Schizophrenia", mentalIllnesses.schizophrenia, `${isSchizophreniaIfEffect(boardState, mentalIllnesses)} moves`)}
    {mentalIllnesses.eatingDisorder > 0 && illnessPoints("Eating disorder", mentalIllnesses.eatingDisorder, `${isEDInEffect(boardState, mentalIllnesses)} moves`)}
    {mentalIllnesses.anxiety > 0 && illnessPoints("Anxiety", mentalIllnesses.anxiety, `${maxTimePerMoveFromAnxiety(mentalIllnesses)} seconds`)}
    {mentalIllnesses.depression > 0 && illnessPoints("Depression", mentalIllnesses.depression, `${spacesSubtractedByDepression(mentalIllnesses)} spaces`)}

    {/*<button onClick={() => document.dispatchEvent(new Event("chess:swap"))}>Swap sides</button>*/}
    {/*<button onClick={() => document.dispatchEvent(new Event("chess:skip"))}>Toggle move</button>*/}
  </div>;
}
