function isMultiple(numberToCheck, multipleOf) {
    return numberToCheck % multipleOf === 0;
}

function preventFloatingError(num) {
    return parseFloat(parseFloat(num).toFixed(6));
}

function debugLog(...args) {
    if (process.env.debug) {
        console.info.apply(this, args);
    }
}

function playerDebug(...args) {
    debugLog.apply(this, ['PLAYER:'.green, ...args]);
}

function tableDebug(...args) {
    debugLog.apply(this, ['TABLE:'.yellow, ...args]);
}

function runnerDebug(...args) {
    debugLog.apply(this, ['RUNNER:'.red, ...args]);
}

module.exports = {
    isMultiple,
    preventFloatingError,
    debugLog,
    playerDebug,
    tableDebug,
    runnerDebug,
};
