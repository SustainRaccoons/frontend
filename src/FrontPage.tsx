import { useState } from "react";
import style from "./App.module.scss";

export const FrontPage = () => {
  const [ruleset, setRuleset] = useState(false)
  return (
      <div>
        <h1>Welcome to Mentally ill chess</h1>
        <p>This is a chess game with a modified ruleset meant to raise awareness about mental illnesses and their affects</p>
        <div className={style.playButtons}>
          <button onClick={() => setRuleset(true)}>Read ruleset</button>
          <button>Host a game</button>
        </div>
        {ruleset &&
          <div className={style.ruleset}>
            <button onClick={() => setRuleset(false)}>X</button>
            <h1 id="rules-set-for-mentally-ill-chess">Rules set for mentally ill chess</h1>
            <p>You can view the basic chess ruleset <a href="https://en.wikipedia.org/wiki/Rules_of_chess">here</a>.</p>
            <h2 id="basic-concept">Basic concept</h2>
            <p>Each piece you loose gives your king a mental illness point which translates to gameplay penalties that represent the rapid decline of the kings mental state. Taking pieces takes away your mental illness points and there for removes the penalties.</p>
            <p>Every piece represents a separete mental illness and gives its own affect, these affects will be listed below. With each lost piece the affect doubles and is eliminated if you have an equal or higher amount of that piece.</p>
            <h2 id="affects-of-loosing-each-piece">Effects of loosing each piece</h2>
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
  )
}
