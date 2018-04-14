const { preventFloatingError, findNearestWholeNumberPayout } = require('./helpers');

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

function calculatePlaceBetFor6and8(numberOfTurns, minBet) {
    if (numberOfTurns === 0) {
        return findNearestWholeNumberPayout(minBet * 2, 7 / 6);
    } else if (numberOfTurns === 2) {
        return -1 * findNearestWholeNumberPayout(minBet, 7 / 6);
    } else if (numberOfTurns === 4) {
        return -1 * findNearestWholeNumberPayout(minBet, 7 / 6);
    }

    return 0;
}

function playLoop(dispatch, stateInstance) {
    const { tableState, gameState } = stateInstance;

    if (!gameState.point) {
        return dispatch('passLineBet', { amount: tableState.tableMinimumBet });
    }

    if (!gameState.passLine.backingBet && gameState.numberOfTurnsSincePointWasEstablished === 0) {
        const backingBet = calculatePassLineBackingBet(stateInstance);
        if (backingBet) {
            dispatch('passLineBackingBet', { amount: backingBet });
        }
    } else if (gameState.passLine.backingBet && gameState.numberOfTurnsSincePointWasEstablished > 4) {
        dispatch('passLineBackingBet', { amount: -1 * gameState.passLine.backingBet });
    }

    const betFor6And8 = calculatePlaceBetFor6and8(gameState.numberOfTurnsSincePointWasEstablished, tableState.tableMinimumBet);
    if (betFor6And8) {
        dispatch('pointNumberPlaceBet', { point: 6, amount: betFor6And8 });
        dispatch('pointNumberPlaceBet', { point: 8, amount: betFor6And8 });
    }
}

module.exports = playLoop;
