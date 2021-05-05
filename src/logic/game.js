import _ from 'lodash';

export function computeMove(state, cellIndex) {
    const turn = state.turn;
    const length = state.players[turn].field[cellIndex];

    state.players[turn].field[cellIndex] = 0;
    let isMovingAgain = false;

    for (let i = 0; i < length; i++) {
        const playerIndex = (Math.floor((cellIndex + i + 1) / 7) % 2) ^ turn;
        const fieldIndex = (cellIndex + i + 1) % 7;
        
        state.players[playerIndex].field[fieldIndex]++;
        if (
            fieldIndex !== 6 && 
            i === length - 1 && 
            state.players[playerIndex].field[fieldIndex] === 1 && 
            state.players[playerIndex ^ 1].field[5 - fieldIndex] !== 0 && 
            turn !== playerIndex ^ 1) {
                state.players[playerIndex].field[6] += state.players[playerIndex ^ 1].field[5 - fieldIndex] + 1;
                state.players[playerIndex].field[fieldIndex] = 0;
                state.players[playerIndex ^ 1].field[5 - fieldIndex] = 0;
        }

        if (i === length - 1 && fieldIndex === 6) {
            isMovingAgain = true;
        }
    }

    if (!isMovingAgain) {
        state.turn ^= 1;
    }
    return state;
}

export function checkWin(state) {
    for (const player of state.players) {
        if (_.isEqual(player.field.slice(0, 6), [0, 0, 0, 0, 0, 0])) {
            const sum_a = state.players[0].field.reduce((a, c) => a + c, 0);
            const sum_b = state.players[1].field.reduce((a, c) => a + c, 0);
            state.players[0].field = [0, 0, 0, 0, 0, 0, sum_a];
            state.players[1].field = [0, 0, 0, 0, 0, 0, sum_b];
            if (sum_a === sum_b) {
                return [true, { name: 'Draw' }]
            }
            return sum_a > sum_b ? [true, state.players[0]] : [true, state.players[1]];
        }
    }
    return [false, null];
}