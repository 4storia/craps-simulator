// eslint-disable-next-line
const colors = require('colors');

const Game = require('./game');
const Player = require('./player');
const Table = require('./table');
const CommandHandler = require('./command-handler');

const { runnerDebug, debugLog } = require('./helpers');
const { InsuficientFundsError } = require('./errors');

const bettingAlgorithm = require('./betting-algorithm');

function rollDice() {
    return [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1];
}

function singleGame(state) {
    const commandHandlerInstance = new CommandHandler(state);
    const dispatcher = commandHandlerInstance.generateDispatcher();

    const { gameState } = state;

    let roll;
    let rollSum;

    do {
        bettingAlgorithm(dispatcher, state);

        roll = rollDice();
        rollSum = roll.reduce((acc, a) => acc + a, 0);

        runnerDebug(`Rolled a ${rollSum} with ${roll}`);
        gameState.handleRoll(roll, rollSum);
    } while (rollSum !== 7);

    // payouts
}

function runner(state, numberOfTimesToPlay) {
    for (let plays = 0; plays < numberOfTimesToPlay; plays++) {
        debugLog('');
        runnerDebug(`Playing game ${plays + 1}`.red);
        singleGame(state);
    }
}

function computeFinalResults(endedWithCash, startingCash) {
    const gamesWon = endedWithCash.reduce((acc, cash) => (cash > 100 ? acc + 1 : acc), 0);
    const gamesWonWith = endedWithCash.reduce((acc, cash) => (cash > 100 ? acc.concat(`$${cash}`) : acc), []);

    const gamesMediocre = endedWithCash.reduce((acc, cash) => (cash > 0 && cash <= 100 ? acc + 1 : acc), 0);
    const gamesMediocreWith = endedWithCash.reduce((acc, cash) => (cash > 0 && cash <= 100 ? acc.concat(`$${cash}`) : acc), []);

    const gamesLost = endedWithCash.reduce((acc, cash) => (cash === 0 ? acc + 1 : acc), 0);

    const finalResult = endedWithCash.reduce((total, cash) => (cash === 0 ? total - 100 : total + cash), 0);
    const finalResultString = finalResult > 0 ? `$${finalResult}` : `-$${finalResult * -1}`;

    console.log(`Number of games that went positive: ${gamesWon}`);
    if (gamesWonWith.length) {
        console.log(`Final cash stacks: ${gamesWonWith.join(', ')}\n`);
    }

    console.log(`Number of games you didn't go broke: ${gamesMediocre}`);
    if (gamesWonWith.length) {
        console.log(`Leftover cash: ${gamesMediocreWith.join(', ')}\n`);
    }

    console.log(`Number of games you lost all your money: ${gamesLost} (That's $${startingCash * gamesLost})`);


    console.log('Grand Total Earned:'.rainbow, `${finalResultString}`);
}


// process.env.debug = true;
const endedWithCash = [];
const startingCash = 100;

for (let instance = 0; instance < 100; instance++) {
    try {
        const tableInstance = new Table({
            tableMinimumBet: 5,
            tableMaximumBet: 5 * 100,
        });
        const playerInstance = new Player({ cash: startingCash });
        const gameInstance = new Game(tableInstance, playerInstance);

        runner({
            tableState: tableInstance,
            playerState: playerInstance,
            gameState: gameInstance,
        }, 100);

        endedWithCash.push(playerInstance.cash);
    } catch (e) {
        if (e instanceof InsuficientFundsError) {
            endedWithCash.push(0);
        } else {
            console.error(e);
        }
    }
}

computeFinalResults(endedWithCash, startingCash);
