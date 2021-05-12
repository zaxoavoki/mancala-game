import { minimax, minimaxWithPrunning } from "../logic/ai";

export default class Player {
  constructor(index, name, reversed = false, playerType='player') {
    this.name = name;
    this.field = [4, 4, 4, 4, 4, 4, 0];
    this.reversed = reversed;
    this.type = playerType;
    this.lvl = 5;
    this.index = index;
  }

  getField() {
    return this.reversed ? [...this.field].reverse() : this.field;
  }

  makeDecision(state) {
    // more efficient algorithm
    return minimaxWithPrunning(-Infinity, Infinity, 0, true, state, this.lvl, this.index);
    // return minimax(0, true, state, this.lvl, this.index);
  }
}
