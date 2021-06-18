import _ from "lodash";
import { computeMove } from "./game";

export function simple_sum_heuristic(state) {
  return (
    state.players[state.turn].field.reduce((a, b) => a + b, 0) -
    state.players[state.turn ^ 1].field.reduce((a, b) => a + b, 0)
  );
}

export function minimaxWithPrunning(
  alpha,
  beta,
  depth = 0,
  expectMax = true,
  state,
  maxDepth = 5,
  isMoving = 0
) {
  const player = state.players[state.turn];
  const options = Array.from(
    { length: player.field.length - 1 },
    (_, i) => i
  ).filter((e) => player.field[e] !== 0);

  if (depth === maxDepth - 1 || options.length === 0) {
    return { value: simple_sum_heuristic(state), index: _.sample(options) };
  }

  const states = options.map((e) => [
    e,
    _.cloneDeep(computeMove(_.cloneDeep(state), e)),
  ]);
  let max = { value: -Infinity, index: null };
  let min = { value: Infinity, index: null };

  if (expectMax) {
    for (const [i, s] of states) {
      const { value } = minimaxWithPrunning(
        alpha,
        beta,
        depth + 1,
        s.turn === isMoving,
        _.cloneDeep(s),
        maxDepth,
        isMoving
      );
      if (max.value < value) {
        max = { value, index: i };
      }
      alpha = Math.max(alpha, max.value);
      if (beta <= alpha) {
        break;
      }
    }

    return max;
  }

  for (const [i, s] of states) {
    const { value } = minimaxWithPrunning(
      alpha,
      beta,
      depth + 1,
      s.turn === isMoving,
      _.cloneDeep(s),
      maxDepth,
      isMoving
    );
    if (min.value > value) {
      min = { value, index: i };
    }
    beta = Math.min(beta, min.value);
    if (beta <= alpha) {
      break;
    }
  }   

  return min;
}
