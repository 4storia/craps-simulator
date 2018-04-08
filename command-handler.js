const commands = require('./commands');
const { InsuficientFundsError, IllegalBetError } = require('./errors');

class CommandHandler {
    constructor(state) {
        this.state = state;
    }

    generateDispatcher() {
        return this.dispatchHandler.bind(this);
    }

    dispatchHandler(command, options) {
        try {
            commands[command](this.state, options);
        } catch (e) {
            if (e instanceof InsuficientFundsError || e instanceof IllegalBetError) {
                throw e;
            }

            throw new Error(`Command ${command} does not exist.`);
        }
    }
}

module.exports = CommandHandler;
