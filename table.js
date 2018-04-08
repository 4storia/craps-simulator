class Table {
    constructor(options = {}) {
        this.tableMinimumBet = options.tableMinimumBet || 5;
        this.tableMaximumBet = options.tableMaximumBet || 10;

        this.rollHistory = [];
    }

    addToRollHistory(roll) {
        this.rollHistory.push(roll);
    }
}

module.exports = Table;
