import _ from 'lodash';
import { computeMove } from "./game";

export function minimax(depth = 0, expectMax = true, state, maxDepth = 5, isMoving = 0) {
  const player = state.players[state.turn];
  const options = Array.from(
    { length: player.field.length - 1 },
    (_, i) => i
  ).filter((e) => player.field[e] !== 0);

  if (depth === maxDepth - 1 || options.length === 0) {
    return { value: simple_sum_heuristic(player), index: null };
  }

  const states = options.map((e) => [e, _.cloneDeep(computeMove(_.cloneDeep(state), e))]);
  let max = { value: -Infinity, index: null };
  let min = { value: Infinity, index: null };

  for (const [i, s] of states) {
    const { value } = minimax(depth + 1, s.turn === isMoving, _.cloneDeep(s), maxDepth, isMoving);
    if (expectMax && max.value < value) max = { value, index: i };
    if (!expectMax && min.value > value) min = { value, index: i };
  }
  return expectMax ? max : min;
}

export function simple_sum_heuristic(player) {
  return player.field.reduce((a,b) => a + b, 0);
}

export function minimaxWithPrunning(alpha, beta, depth = 0, expectMax = true, state, maxDepth = 5, isMoving = 0) {
  const player = state.players[state.turn];
  const options = Array.from(
    { length: player.field.length - 1 },
    (_, i) => i
  ).filter((e) => player.field[e] !== 0);

  if (depth === maxDepth - 1 || options.length === 0) {
    return { value: simple_sum_heuristic(player), index: null };
  }

  const states = options.map((e) => [e, _.cloneDeep(computeMove(_.cloneDeep(state), e))]);
  let max = { value: -Infinity, index: null };
  let min = { value: Infinity, index: null };

  for (const [i, s] of states) {
    const { value } = minimaxWithPrunning(alpha, beta, depth + 1, s.turn === expectMax, _.cloneDeep(s), maxDepth, isMoving);
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