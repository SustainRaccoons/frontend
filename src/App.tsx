import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import style from "./App.module.scss";
import { decodeBoardState, encodeBoardState } from "./boardState.ts";
import { makeDefaultExtendedBoardState } from "./defaultBoardState.ts";
import Game from "./Game.tsx";
import { ExtendedBoardState, Side } from "./types.ts";
import {FrontPage} from "./FrontPage.tsx";
import "./main.scss";

export default function App() {
  const [ joinValue, setJoinValue ] = useState("");
  const [ gameActive, setGameActive ] = useState(false);
  const [ playingSide, setPlayingSide ] = useState(Math.random() > .5 ? Side.White : Side.Black);
  const [ hostId, setHostId ] = useState("");
  const [ boardState, setBoardState ] = useState<ExtendedBoardState>(makeDefaultExtendedBoardState());
  const [ lastBoardUpdate, setLastBoardUpdate ] = useState(0);

  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8080");

  useEffect(() => {
    const chessEndEvent = () => setGameActive(false);
    document.addEventListener("chess:end", chessEndEvent);

    const chessSwapSide = () => setPlayingSide(side => side === Side.White ? Side.Black : Side.White);
    document.addEventListener("chess:swap", chessSwapSide);

    return () => {
      document.removeEventListener("chess:end", chessEndEvent);
      document.removeEventListener("chess:swap", chessSwapSide);
    };
  }, []);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    const msg = lastMessage.data as string;
    if (msg.startsWith("id:")) {
      const id = msg.substring(3);
      setHostId(id);
    }

    if (msg === "join:success") {
      setGameActive(true);
      setJoinValue("");
    }

    if (msg.startsWith("state:")) {
      const state = msg.substring(6);
      if (state === "fail") {
        return;
      }

      setBoardState(decodeBoardState(state));
      setLastBoardUpdate(Date.now());
    }

    if (msg.startsWith("side:")) {
      const side = msg.substring(5);
      if (side === "white") {
        setPlayingSide(Side.White);
      } else if (side === "black") {
        setPlayingSide(Side.Black);
      }
    }

    if (msg === "close") {
      document.dispatchEvent(new Event("chess:end"));
    }

    console.log(lastMessage.data);
  }, [ lastMessage ]);

  useEffect(() => {
    if (Date.now() > lastBoardUpdate + 10) {
      sendMessage(`state:${encodeBoardState(boardState)}`);
    }
  }, [ boardState ]);

  if (gameActive) {
    return <div className={style.App}><Game
          side={playingSide}
          boardState={boardState}
          setBoardState={setBoardState} /></div>;
  }

  if (readyState !== ReadyState.OPEN) {
    return <div className={style.App}>
      <FrontPage />
      <div>
        {readyState === ReadyState.CONNECTING ? "Loading webscokets..." : null}
        {readyState === ReadyState.CLOSED ? "Failed to connect to websockets" : null}
      </div>
      <div>
        <button onClick={() => setGameActive(true)}>Local debug</button>
      </div>
    </div>;
  }

  return <div className={style.App}>
    <div>
      <button onClick={() => setGameActive(true)}>Local debug</button>
    </div>
    <div>
      <input
            placeholder="Game code"
            value={joinValue}
            onChange={v => setJoinValue(v.target.value)} />
      <button
            onClick={() => {
              sendMessage(`join:${joinValue}`);
            }}>
        Join
      </button>
    </div>
    <div>
      <button
            onClick={() => {
              sendMessage("host");
              sendMessage(`state:${encodeBoardState(boardState)}`);
            }}>
        Host
      </button>
      {hostId ? `Join code: ${hostId}` : null}
    </div>
  </div>;
}
