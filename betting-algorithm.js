const { preventFloatingError } = require('./helpers');

function calculatePassLineBackingBet(state) {
    const { tableState, playerState, gameState } = state;
    const { point } = gameState;

    if (point === 4 || point === 10) {
        if (playerState.cash < 80) return 0;

        return tableState.tableMinimumBet;
    }

    if (point === 5 || point === 9) {
        if (playerState.cash < 40) return 0;

        let backingBet = tableState.tableMinimumBet;
        while (preventFloatingError(backingBet % (3 / 2)) !== 0) {
            backingBet++;
        }

        return backingBet;
    }

    if (point === 6 || point === 8) {
        if (playerState.cash < 20) return 0;

        let backingBet = tableState.tableMinimumBet;
        while (preventFloatingError(backingBet % (6 / 5)) !== 0) {
            backingBet++;
        }

        return backingBet;
    }
}

function playLoop(dispatch, stateInstance) {
    const { tableState, gameState } = stateInstance;

    if (!gameState.point) {
        return dispatch('passLineBet', { amount: tableState.tableMinimumBet });
    }

    if (!gameState.passLine.backingBet) {
        const backingBet = calculatePassLineBackingBet(stateInstance);
        if (backingBet) {
            dispatch('passLineBackingBet', { amount: backingBet });
        }
    }
}

module.exports = playLoop;
