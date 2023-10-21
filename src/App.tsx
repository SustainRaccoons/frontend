import { useEffect, useState } from "react";
import Game from "./Game.tsx";
import { GameType, Side } from "./types.ts";

export default function App() {
  const [ joinValue, setJoinValue ] = useState("");
  const [ gameType, setGameType ] = useState<null | GameType>(GameType.Local);
  const [ playingSide, setPlayingSide ] = useState(Side.White);

  useEffect(() => {
    const chessEndEvent = () => setGameType(null);
    document.addEventListener("chess:end", chessEndEvent);

    return () => {
      document.removeEventListener("chess:end", chessEndEvent);
    };
  }, []);

  if (gameType !== null) {
    return <Game type={gameType} side={playingSide} />;
  }

  return <>
    <div>
      <button onClick={() => setGameType(GameType.Local)}>Local</button>
    </div>
    <div>
      <input
            placeholder="Game code"
            value={joinValue}
            onChange={v => setJoinValue(v.target.value)} />
      <button>Join</button>
    </div>
    <div>
      <button>Host</button>
    </div>
  </>;
}
