const { tableDebug } = require('./helpers');
const { PassLine } = require('./board');

class Game {
    constructor(tableInstance, playerInstance, existingState = {}) {
        this.tableInstance = tableInstance;
        this.playerInstance = playerInstance;
        this.playerInstance.setCircularGameReference(this);

        this.passLine = new PassLine(existingState.passLine);

        this.rollHistory = [];
        this.point = null;
    }

    handleRoll(roll, rollSum) {
        this.rollHistory.push(roll);

        if (rollSum === 7 && this.point) {
            this.point = null;
            return this.passLine.resetLine();
        }

        if (!this.point) {
            if (rollSum === 7 || rollSum === 11) {
                tableDebug(`Lucky! Roll of ${rollSum}! Pass line bet payout!`);
                const passLinePayout = this.passLine.calculatePayout(rollSum);
                this.playerInstance.addMoney(passLinePayout);
                return this.passLine.resetLine();
            }

            if (rollSum > 3 && rollSum < 11) {
                this.point = rollSum;
                return tableDebug(`Point is set to ${rollSum}`);
            }

            tableDebug('Craps! Everyone loses pass line bets!');
            return this.passLine.resetLine();
        }

        if (rollSum === this.point) {
            tableDebug(`Rolled the point of ${this.point}!`);
            const passLinePayout = this.passLine.calculatePayout(rollSum);
            this.playerInstance.addMoney(passLinePayout);
            this.point = null;
            this.passLine.resetLine();
            return tableDebug('New round of rolling!');
        }
    }
}

module.exports = Game;
