const { playerDebug } = require('./helpers');

class Player {
    constructor(startingState = {}) {
        this.cash = startingState.cash || 100;
    }

    setCircularGameReference(gameInstance) {
        this.gameInstance = gameInstance;
    }

    addMoney(amount) {
        this.cash += amount;
        playerDebug(`Added $${amount} to player stack, new total is $${this.cash}`);
    }

    removeMoney(amount) {
        this.cash -= amount;
        playerDebug(`Removed $${amount} from player stack, new total is $${this.cash}`);
    }

    // Should take a +/- number
    diffMoney(amount) {
        if (amount < 0) {
            return this.removeMoney(amount * -1);
        }

        return this.addMoney(amount);
    }
}

module.exports = Player;
