const { IllegalBetError } = require('./errors');
const { checkOutsideTableBetRange, checkCanPlayerBetAmount, checkCanPlayerRemoveAmount } = require('./common-error-checks');
const { isMultiple, betDebug } = require('./helpers');

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

    betDebug(`Pass line bet of $${bet.amount}`);
}

function passLineBackingBet({ tableState, playerState, gameState }, bet) {
    if (!gameState.passLine.initialBet) throw new IllegalBetError('Cannot back a pass line bet before first betting on the pass line');

    if (bet.amount >= 0) {
        checkOutsideTableBetRange(tableState, bet.amount);
        checkCanPlayerBetAmount(playerState, bet.amount);
    } else {
        checkCanPlayerRemoveAmount(gameState.passLine.backingBet, bet.amount);
    }

    playerState.diffMoney(bet.amount * -1);
    gameState.passLine.back(bet.amount);
    betDebug(`Pass line backing bet of $${bet.amount}`);
}

function pointNumberPlaceBet({ tableState, playerState, gameState }, bet) {
    const point = parseInt(bet.point);

    if (point < 3 || point > 10) throw new IllegalBetError('Place bet must be between 4-10');

    if (bet.amount >= 0) {
        checkOutsideTableBetRange(tableState, bet.amount);
        checkCanPlayerBetAmount(playerState, bet.amount);
    } else {
        checkCanPlayerRemoveAmount(gameState.pointNumbers.points[String(bet.point)].backingBet, bet.amount);
    }

    playerState.diffMoney(bet.amount * -1);
    gameState.pointNumbers.back(point, bet.amount);
    betDebug(`Place bet on ${point} of $${bet.amount}`);
}

module.exports = {
    passLineBet,
    passLineBackingBet,
    pointNumberPlaceBet,
};
