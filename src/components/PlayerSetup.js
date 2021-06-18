import Player from "../data/Player";

export default function PlayerSetup({ index, state, setState }) {
  function setBotDifficulthy(value) {
    setState((p) => {
      if (p.players[index]) {
        p.players[index].lvl = +value;
      }
      return { ...p };
    });
  }
    
  function addPlayer(type) {
    setState((p) => {
      p.players[index] = new Player(index, index === 0 ? 'A' : 'B', !index, type);
      return { ...p, players: p.players };
    });
  }

  return (
    <>
      Player {index === 0 ? 'A' : 'B' }:
      <select
        required
        className="player-select"
        onChange={(e) => addPlayer(e.target.value)}
        defaultValue={""}
      >
        <option disabled value="">
          Type
        </option>
        <option value="player">Player</option>
        <option value="bot">Bot</option>
      </select>
      {state.players[index] && state.players[index].type === "bot" && (
        <>
          <span style={{ margin: "0 1rem 0 0" }}>
            {state.players[index].lvl}
          </span>
          <input
            value={state.players[index].lvl}
            step="1"
            type="range"
            min="1"
            max="10"
            onChange={(e) => setBotDifficulthy(e.target.value)}
          />
        </>
      )}
    </>
  )
}
