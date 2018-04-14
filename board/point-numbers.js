const { tableDebug, casinoRound } = require('../helpers');

class PointNumbers {
    constructor(existingState) {
        const pointNumbers = [4, 5, 6, 8, 9, 10];

        this.points = existingState || {};
        if (!existingState) {
            pointNumbers.forEach((point) => {
                this.points[point] = {
                    backingBet: 0,
                    buyBet: 0,
                };
            });
        }
    }

    calculatePayout(rollSum) {
        const point = this.points[String(rollSum)];

        if (!point.backingBet) return 0;

        /*
            9-to-5 on points 4 or 10,
            7-to-5 on points 5 or 9,
            7-to-6 on points 6 or 8.

            The place bets on the outside numbers (4,5,9,10) should be made in units of $5, (on a $5 minimum table),
                in order to receive the correct exact payout of $5 paying $7 or $5 paying $9.
            The place bets on the 6 & 8 should be made in units of $6, (on a $5 minimum table),
                in order to receive the correct exact payout of $6 paying $7.
            For the 4 and 10, it is to the player's advantage to 'buy' the bet (see below).
         */

        if (rollSum === 4 || rollSum === 10) {
            return casinoRound(point.backingBet, (9 / 5));
        }

        if (rollSum === 5 || rollSum === 9) {
            return casinoRound(point.backingBet, (7 / 5));
        }

        if (rollSum === 6 || rollSum === 8) {
            return casinoRound(point.backingBet, (7 / 6));
        }

        throw Error(`invalid number into calculatePayout of ${rollSum}`);
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


module.exports = PointNumbers;
