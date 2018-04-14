function isMultiple(numberToCheck, multipleOf) {
    return numberToCheck % multipleOf === 0;
}

function findAverage(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
}

function preventFloatingError(num) {
    return parseFloat(parseFloat(num).toFixed(6));
}

function hasRemainder(num, divisor) {
    const multiple = preventFloatingError(num * divisor);
    return Math.round(multiple) !== multiple;
}

function findNearestWholeNumberPayout(minimumBet, odds) {
    let bet = minimumBet;
    while (hasRemainder(bet, odds)) {
        bet++;
    }
    return bet;
}

function casinoRound(bet, odds) {
    const rawPayot = bet * odds;

    if (preventFloatingError(rawPayot % 1) > 50) {
        return parseInt(rawPayot) + 1;
    }

    if (rawPayot < 1) {
        return 1;
    }

    return parseInt(rawPayot);
}

function debugLog(...args) {
    if (process.env.debug) {
        console.info.apply(this, args);
    }
}

function playerDebug(...args) {
    debugLog.apply(this, ['PLAYER:'.green, ...args]);
}

function betDebug(...args) {
    debugLog.apply(this, ['BET:'.blue, ...args]);
}

function tableDebug(...args) {
    debugLog.apply(this, ['TABLE:'.yellow, ...args]);
}

function runnerDebug(...args) {
    debugLog.apply(this, ['RUNNER:'.red, ...args]);
}

module.exports = {
    isMultiple,
    casinoRound,
    findAverage,
    preventFloatingError,
    findNearestWholeNumberPayout,
    debugLog,
    playerDebug,
    betDebug,
    tableDebug,
    runnerDebug,
};
