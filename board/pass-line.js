const { tableDebug } = require('../helpers');

class PassLine {
    constructor(existingState = {}) {
        this.initialBet = existingState.initialBet || 0;
        this.backingBet = existingState.backingBet || 0;
    }

    calculatePayout(point) {
        const initialBetPayout = this.initialBet * 2;

        if (!this.backingBet) return initialBetPayout;

        /* backing bets pay at the true odds of:
            2-to-1 if 4 or 10 is the point
            3-to-2 if 5 or 9 is the point
            6-to-5 if 6 or 8 is the point */

        if (point === 4 || point === 10) {
            return initialBetPayout + (this.backingBet * 2);
        }

        if (point === 5 || point === 9) {
            return initialBetPayout + parseInt(this.backingBet * (3 / 2));
        }

        if (point === 6 || point === 8) {
            return initialBetPayout + parseInt(this.backingBet * (6 / 5));
        }

        // Unknown point :/
        return 0;
    }

    bet(amount) {
        this.initialBet = amount;
    }

    back(changeAmount) {
        this.backingBet += changeAmount;
    }

    resetLine() {
        this.initialBet = 0;
        this.backingBet = 0;
        tableDebug('Resetting line');
    }
}


module.exports = PassLine;
