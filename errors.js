class IllegalBetError extends Error {
    constructor(message) {
        super(`Illegal Bet: ${message}`);
    }
}

class InsuficientFundsError extends Error {
    constructor(message) {
        super(`Insuficient Funds: ${message}`);
    }
}

module.exports = {
    IllegalBetError,
    InsuficientFundsError,
};
