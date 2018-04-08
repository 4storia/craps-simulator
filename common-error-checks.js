const { IllegalBetError, InsuficientFundsError } = require('./errors');

function checkOutsideTableBetRange(tableState, betAmount) {
    // Bet must be below table maximum bet
    if (betAmount > tableState.tableMaximumBet) {
        throw new IllegalBetError(`Pass line bet of ${betAmount} is higher than the table maximum bet of ${tableState.tableMaximumBet}`);
    }

    // Bet must be below table maximum bet
    if (betAmount < tableState.tableMinimumBet) {
        throw new IllegalBetError(`Pass line bet of ${betAmount} is lower than the table minimum bet of ${tableState.tableMinimumBet}`);
    }
}

function checkCanPlayerBetAmount(playerState, betAmount) {
    if (playerState.cash < betAmount) throw new InsuficientFundsError(`Bet of ${betAmount} exceeds the player's cash pile of ${playerState.cash}`);
}

function checkCanPlayerRemoveAmount(pileAmount, betAmount) {
    if (pileAmount < betAmount) throw new IllegalBetError(`You cannot remove ${betAmount * -1} from a stack of only ${pileAmount}`);
}

module.exports = {
    checkOutsideTableBetRange,
    checkCanPlayerBetAmount,
    checkCanPlayerRemoveAmount,
};
