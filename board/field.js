const { tableDebug, casinoRound } = require('../helpers');

class Field {
    constructor(existingState = {}) {
        this.fieldNumbers = [2, 3, 4, 9, 10, 11, 12];
        this.bet = existingState.bet || 0;
    }

    updateFieldBet(rollSum) {
        if (this.fieldNumbers.includes(rollSum)) {
            this.bet *= 2;
            return;
        }

        this.bet = 0;
    }

    back(point, changeAmount) {
        this.points[point].backingBet += changeAmount;
    }

    buy(point, changeAmount) {
        this.points[point].buyBet += changeAmount;
    }

    resetPointNumbers() {
        tableDebug('Resetting point numbers');
        const moneyRemainingOnTable = Object.keys(this.points).reduce((acc, point) => {
            const moneyOnNumber = this.points[point].backingBet + this.points[point].buyBet;

            this.points[point].backingBet = 0;
            this.points[point].buyBet = 0;

            return acc + moneyOnNumber;
        }, 0);

        return moneyRemainingOnTable;
    }
}


module.exports = Field;
