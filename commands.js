const { IllegalBetError } = require('./errors');
const { checkOutsideTableBetRange, checkCanPlayerBetAmount, checkCanPlayerRemoveAmount } = require('./common-error-checks');
const { isMultiple, playerDebug } = require('./helpers');

function passLineBet({ tableState, playerState, gameState }, bet) {
    // Cannot bet the line after the point has been established
    if (tableState.point) throw new IllegalBetError(`Point already established as ${tableState.point}, betting "Pass Line" is not allowed`);

    checkOutsideTableBetRange(tableState, bet.amount);

    // Pass line bet must be a multiple of the table minimum
    if (!isMultiple(bet.amount, tableState.tableMinimumBet)) {
        throw new IllegalBetError(`Pass line bet of $${bet.amount} is not a multiple of the table minimum bet, which is $${tableState.tableMinimumBet}`);
    }

    checkCanPlayerBetAmount(playerState, bet.amount);

    playerState.removeMoney(bet.amount);
    gameState.passLine.bet(bet.amount);

    playerDebug(`Pass line bet of $${bet.amount}`);
}

function passLineBackingBet({ tableState, playerState, gameState }, bet) {
    if (!gameState.passLine.initialBet) throw new IllegalBetError('Cannot back a pass line bet before first betting on the pass line');
    checkOutsideTableBetRange(tableState, bet.amount);

    if (bet.amount >= 0) {
        checkCanPlayerBetAmount(playerState, bet.amount);
    } else {
        checkCanPlayerRemoveAmount(gameState.passLine.backingBet, bet.amount);
    }

    playerState.removeMoney(bet.amount);
    gameState.passLine.back(bet.amount);
    playerDebug(`Pass line backing bet of $${bet.amount}`);
}

module.exports = {
    passLineBet,
    passLineBackingBet,
};
