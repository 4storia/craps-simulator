const { findLastIndex } = require('lodash');
const { tableDebug } = require('./helpers');
const { PassLine, PointNumbers } = require('./board');
const { cloneDeep } = require('lodash');

class Game {
    constructor(tableInstance, playerInstance, existingState = {}) {
        this.tableInstance = tableInstance;
        this.playerInstance = playerInstance;
        this.playerInstance.setCircularGameReference(this);

        this.passLine = new PassLine(existingState.passLine);
        this.pointNumbers = new PointNumbers(existingState.pointNumbers);

        this.rollHistory = [];
        this.point = null;
    }

    get numberOfTurnsSincePointWasEstablished() {
        const lastIndex = findLastIndex(this.rollHistory, roll => roll.isPoint);
        if (lastIndex < 0) return -1;

        return this.rollHistory.length - 1 - lastIndex;
    }

    getCurrentState() {
        return {
            passLine: cloneDeep(this.passLine),
            pointNumbers: cloneDeep(this.pointNumbers),
            point: this.point,
        };
    }

    handleRoll(roll, rollSum) {
        const rollRecord = { roll, rollSum, isPoint: false };

        this.rollHistory.push(rollRecord);

        if (rollSum === 7 && this.point) {
            this.point = null;
            const moneyLost = this.pointNumbers.resetPointNumbers() + this.passLine.resetLine();
            return tableDebug(`Bad luck! Roll of 7. Lost $${moneyLost} from the table`);
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
                rollRecord.isPoint = true;
                return tableDebug(`Point is set to ${rollSum}`.yellow);
            }

            tableDebug('Craps! Everyone loses pass line bets!');
            return this.passLine.resetLine();
        }

        if (rollSum === this.point) {
            rollRecord.point = true;
            tableDebug(`Rolled the point of ${this.point}!`.yellow);
            const passLinePayout = this.passLine.calculatePayout(rollSum);
            this.playerInstance.addMoney(passLinePayout);
            this.point = null;
            rollRecord.isPoint = true;
            this.passLine.resetLine();
            const remainingPointNumberCash = this.pointNumbers.resetPointNumbers();
            tableDebug('Returning all place bets on 4-10 to the player');
            this.playerInstance.addMoney(remainingPointNumberCash);
            tableDebug('New round of rolling!');
            return tableDebug('---------------------------------');
        }

        // default roll sum

        if (rollSum > 3 && rollSum < 11) {
            const pointNumbersPayout = this.pointNumbers.calculatePayout(rollSum);
            if (pointNumbersPayout) {
                tableDebug(`Point payout on ${rollSum} of $${pointNumbersPayout}`);
                this.playerInstance.addMoney(pointNumbersPayout);
            }
        }
    }
}

module.exports = Game;
