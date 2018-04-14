const commands = require('./commands');

class CommandHandler {
    constructor(state) {
        this.state = state;
        this.actionRecord = [];
    }

    generateDispatcher() {
        return this.dispatchHandler.bind(this);
    }

    dispatchHandler(command, options) {
        try {
            commands[command](this.state, options);
            this.actionRecord.push({ command, options });
        } catch (e) {
            if (!commands[command]) {
                throw new Error(`Command ${command} does not exist.`);
            }
            throw e;
        }
    }

    resetActionRecord() {
        this.actionRecord = [];
    }
}

module.exports = CommandHandler;
