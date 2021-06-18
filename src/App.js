import { useState, useEffect } from "react";
import _ from "lodash";
import { computeMove, checkWin } from "./lib/game";
import PlayerSetup from "./components/PlayerSetup";
import Field from "./components/Field";

export const initialState = {
  winner: false,
  started: false,
  turn: null,
  players: [],
};

function App() {
  const [state, setState] = useState(_.cloneDeep(initialState));

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
    setState(_.cloneDeep(initialState));
  }

  return (
    <div>
      {!state.started || state.winner ? (
        <div id="panel">
          {!state.started && !state.winner ? (
            <div className="select">
              <PlayerSetup state={state} setState={setState} index={0} />
              <PlayerSetup state={state} setState={setState} index={1} />
            </div>
          ) : (
            ""
          )}
          {state.winner && (
            <button onClick={() => restartGame()} className="m-auto btn">
              New game
            </button>
          )}
          {!state.started && state.players.length === 2 && (
            <button onClick={() => startGame()} className="m-auto btn">
              Start
            </button>
          )}
        </div>
      ) : (
        ""
      )}
      {state.winner ? <h3>Game over, Player {state.winner.name} won!</h3> : ""}
      {!state.started ? <h2>Choose players and press Start</h2> : ""}

      <Field state={state} moveStones={moveStones} />
      {state.started && !state.winner && (
        <button
          style={{ marginTop: "0.5rem" }}
          onClick={() => restartGame()}
          className="btn m-auto"
        >
          Reset game
        </button>
      )}
    </div>
  );
}

export default App;
