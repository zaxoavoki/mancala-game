import _ from 'lodash';
import { computeMove } from "./game";

export function minimax(depth = 0, expectMax = true, state, max_depth = 5) {
  const player = state.players[state.turn];
  const options = Array.from(
    { length: player.field.length - 1 },
    (_, i) => i
  ).filter((e) => player.field[e] !== 0);

  if (depth === max_depth - 1 || options.length === 0) {
    return { value: player.field[6], index: null };
  }

  const states = options.map((e) => [e, _.cloneDeep(computeMove(_.cloneDeep(state), e))]);
  let max = { value: -Infinity, index: null };
  let min = { value: Infinity, index: null };

  for (const [i, s] of states) {
    const { value } = minimax(depth + 1, !expectMax, _.cloneDeep(s), max_depth);
    if (expectMax && max.value < value) max = { value, index: i };
    if (!expectMax && min.value > value) min = { value, index: i };
  }
  return expectMax ? max : min;
}

export function minimaxWithPrunning(alpha, beta, depth = 0, expectMax = true, state, max_depth = 5) {
  const player = state.players[state.turn];
  const options = Array.from(
    { length: player.field.length - 1 },
    (_, i) => i
  ).filter((e) => player.field[e] !== 0);

  if (depth === max_depth - 1 || options.length === 0) {
    return { value: player.field[6], index: null };
  }

  const states = options.map((e) => [e, _.cloneDeep(computeMove(_.cloneDeep(state), e))]);
  let max = { value: -Infinity, index: null };
  let min = { value: Infinity, index: null };

  for (const [i, s] of states) {
    const { value } = minimaxWithPrunning(alpha, beta, depth + 1, !expectMax, _.cloneDeep(s), max_depth);
    if (expectMax) {
      if (max.value < value) {
        max = { value, index: i };
      }
      alpha = Math.max(alpha, max.value);
      if (beta <= alpha) {
        break;
      }
    } else {
      if (min.value > value) {
        min = { value, index: i };
      }
      beta = Math.min(beta, min.value);
      if (beta <= alpha) {
        break;
      }
    }
  }
  return expectMax ? max : min;
}