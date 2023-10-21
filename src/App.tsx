import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import style from "./App.module.scss";
import { decodeBoardState, encodeBoardState } from "./boardState.ts";
import { makeDefaultExtendedBoardState } from "./defaultBoardState.ts";
import { FrontPage } from "./FrontPage.tsx";
import Game from "./Game.tsx";
import "./main.scss";
import { ExtendedBoardState, invertSide, Side } from "./types.ts";

export default function App() {
  const [ joinValue, setJoinValue ] = useState("");
  const [ gameActive, setGameActive ] = useState(false);
  const [ playingSide, setPlayingSide ] = useState(Math.random() > .5 ? Side.White : Side.Black);
  const [ hostId, setHostId ] = useState("");
  const [ boardState, setBoardState ] = useState<ExtendedBoardState>(makeDefaultExtendedBoardState());
  const [ lastBoardUpdate, setLastBoardUpdate ] = useState(0);
  const [ruleset, setRuleset] = useState(false)

  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://nav.lv:8081");

  useEffect(() => {
    const chessEndEvent = () => setGameActive(false);
    document.addEventListener("chess:end", chessEndEvent);

    const chessSwapSide = () => setPlayingSide(side => side === Side.White ? Side.Black : Side.White);
    document.addEventListener("chess:swap", chessSwapSide);

    const chessDebugSwapMove = () => setBoardState(state => ({ ...state, active: invertSide(state.active) }));
    document.addEventListener("chess:debug:swap_move", chessDebugSwapMove);

    return () => {
      document.removeEventListener("chess:end", chessEndEvent);
      document.removeEventListener("chess:swap", chessSwapSide);
      document.removeEventListener("chess:debug:swap_move", chessDebugSwapMove);
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
      setHostId("");
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
      <h1>Welcome to Mentally ill chess</h1>
      <p>This is a chess game with a modified ruleset meant to raise awareness about mental illnesses and their affects</p>
      <div className={style.playButtons}>
        <button onClick={() => setRuleset(true)}>Read ruleset</button>
      </div>
      <div className={style.playButtons}>
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
      <div className={style.playButtons}>
        <button
            onClick={() => {
              sendMessage("host");
              sendMessage(`state:${encodeBoardState(boardState)}`);
            }}>
          Host
        </button>
        <p>{hostId ? `Join code: ${hostId}` : null}</p>
      </div>
      {ruleset &&
          <div className={style.ruleset}>
              <button onClick={() => setRuleset(false)}>X</button>
              <h1 id="rules-set-for-mentally-ill-chess">Rules set for mentally ill chess</h1>
              <p>You can view the basic chess ruleset <a href="https://en.wikipedia.org/wiki/Rules_of_chess">here</a>.</p>
              <h2 id="basic-concept">Basic concept</h2>
              <p>Each piece you loose gives your king a mental illness point which translates to gameplay penalties that represent the rapid decline of the kings mental state. Taking pieces takes away your mental illness points and there for removes the penalties.</p>
              <p>Every piece represents a separete mental illness and gives its own affect, these affects will be listed below. With each lost piece the affect doubles and is eliminated if you have an equal or higher amount of that piece.</p>
            <h2 id="effects-of-loosing-each-piece">Effects of loosing each piece</h2>
              <h3 id="the-queen">The Queen</h3>
              <p>If your king looses the queen he develops &quot;Crippling self doubt&quot; which makes him heavily doubt every move he makes, there for every move takes two turns.</p>
              <h3 id="the-pawn">The Pawn</h3>
              <p>Loosing the pawn gives the king depression points, which means the rook, bishop, and the queen looses one point of movement for every pawn lost, so if you loose one pawn, your rooks max tiles moved goes from 8 to 7.</p>
              <h3 id="the-rook">The Rook</h3>
              <p>Rooks represent Eating disorder (ED), when you develop and ED you can only take enemy pieces every other move. If the only moves you can make are taking a piece, the move is skipped</p>
              <h3 id="the-knight">The Knight</h3>
              <p>The knight represents anxiety about the pressure of battle, it adds a timer to every move, if this timer runs out, you skip the turn.</p>
              <h3 id="the-bishup">The Bishop</h3>
              <p>Loosing a bishop develops the kings schizophrenia, making him hallucinate voices that force him to take an enemy piece every 8th move, if this is not possible, the move is skipped</p>
          </div>
      }
    </div>
    <div>
      <button onClick={() => setGameActive(true)}>Local debug</button>
    </div>
  </div>;
}
