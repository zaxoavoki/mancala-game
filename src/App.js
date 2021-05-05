import { useState, useEffect } from "react";
import _ from "lodash";
import Player from "./data/Player";
import { computeMove, checkWin } from "./logic/game";

function App() {
  const [state, setState] = useState({
    winner: false,
    started: false,
    turn: null,
    players: [],
  });

  useEffect(() => {
    if (
      !state.winner &&
      state.started &&
      state.players[state.turn].type === "bot"
    ) {
      botMove();
    }
  });

  function botMove() {
    const { index } = state.players[state.turn].makeDecision(
      _.cloneDeep(state)
    );
    console.log("index", index);
    moveStones(index);
  }

  function moveStones(cellIndex) {
    if (state.players[state.turn].field[cellIndex] === 0) {
      console.log("You can not click on empty cell");
      return;
    }
    if (cellIndex === 6) {
      return;
    }
    setState((prevState) => {
      const newState = computeMove(_.cloneDeep(prevState), cellIndex);
      const [won, winner] = checkWin(newState);
      return { ...prevState, ...newState, winner: won ? winner : false };
    });
  }

  function startGame() {
    if (state.players.length !== 2) {
      console.log("You need to choose type of the players!");
      return;
    }
    setState((p) => ({ ...p, started: true, turn: 0 }));
  }

  function restartGame() {
    setState({
      started: false,
      winner: false,
      turn: null,
      players: [],
    });
  }

  function addPlayer(index, type) {
    const [name, playerType] = type.split("-");
    setState((p) => {
      const players = p.players;
      players[index] = new Player(name, !index, playerType);
      return { ...p, players };
    });
  }

  function setBotDifficulthy(index, value) {
    setState(p => {
      if (p.players[index]) {
        p.players[index].lvl = +value;
      }
      return { ...p };
    });
  }

  return (
    <div>
      {!state.started || state.winner ? (
        <div id="panel">
          {!state.started && !state.winner ? (
            <div className="select">
              Player A:
              <select
                required
                id="playerA"
                className="player-select"
                onChange={(e) => addPlayer(0, e.target.value)}
                defaultValue={""}
              >
                <option disabled value="">
                  Type
                </option>
                <option value="A-player">Player</option>
                <option value="A-bot">Bot</option>
              </select>
              <input defaultValue="4" step="1" type="range" min="1" max="10" onClick={(e) => setBotDifficulthy(0, e.target.value) }/>
              Player B:
              <select
                required
                id="playerA"
                className="player-select"
                onChange={(e) => addPlayer(1, e.target.value)}
                defaultValue={""}
              >
                <option disabled value="">
                  Type
                </option>
                <option value="B-player">Player</option>
                <option value="B-bot">Bot</option>
              </select>
              <input defaultValue="4" step="1" type="range" min="1" max="10" onChange={(e) => setBotDifficulthy(1, e.target.value)} />
            </div>
          ) : (
            ""
          )}
          <div className="btns">
            {state.winner && (
              <button onClick={() => restartGame()} className="btn">
                New game
              </button>
            )}
            {!state.started && (
              <button onClick={() => startGame()} className="btn">
                Start
              </button>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {state.winner ? <h3>Game over, Player {state.winner.name} won!</h3> : ""}
      {!state.started ? <h2>Choose players and press Start</h2> : ""}
      {state.players.map((player, j) => (
        <div key={Date.now() + Math.random().toFixed(j)} className="row">
          {!player.reversed && <div className="hidden-cell cell" />}
          {player.getField().map((stones, i) => (
            <div
              key={Date.now() + Math.random().toFixed(i)}
              className={`${state.turn !== j ? "disabled" : ""} cell`}
              onClick={() =>
                state.turn === j && moveStones(player.reversed ? 6 - i : i)
              }
            >
              {stones}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
