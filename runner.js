// eslint-disable-next-line
const colors = require('colors');
// const fs = require('fs');

const Game = require('./game');
const Player = require('./player');
const Table = require('./table');
const CommandHandler = require('./command-handler');

const { runnerDebug, debugLog, findAverage } = require('./helpers');
const { InsuficientFundsError } = require('./errors');

const bettingAlgorithm = require('./betting-algorithm');

function rollDice() {
    return [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1];
}

function singleGame(state) {
    const { tableState, playerState } = state;
    const gameState = new Game(tableState, playerState);
    const instanceState = { tableState, gameState, playerState };
    const commandHandlerInstance = new CommandHandler(instanceState);
    const dispatcher = commandHandlerInstance.generateDispatcher();

    const history = [];

    let roll;
    let rollSum;
    let roundOver;

    do {
        const turnHistory = {
            startingState: {
                gameState: gameState.getCurrentState(),
                playerState: playerState.getCurrentState(),
            },
        };

        bettingAlgorithm(dispatcher, instanceState);

        turnHistory.playerActions = commandHandlerInstance.actionRecord;
        turnHistory.stateAfterPlayerActions = {
            gameState: gameState.getCurrentState(),
            playerState: playerState.getCurrentState(),
        };

        roll = rollDice();
        rollSum = roll.reduce((acc, a) => acc + a, 0);

        if (rollSum === 7 && gameState.point) {
            roundOver = true;
        }

        turnHistory.rollAfterPlayerActions = { roll, rollSum };

        runnerDebug(`Rolled a ${rollSum} with ${roll}`);
        gameState.handleRoll(roll, rollSum);

        turnHistory.endingState = {
            gameState: gameState.getCurrentState(),
            playerState: playerState.getCurrentState(),
        };

        history.push(turnHistory);
        commandHandlerInstance.resetActionRecord();
    } while (!roundOver);

    return history;
}

function runner(state, numberOfTimesToPlay) {
    const history = [];

    for (let plays = 0; plays < numberOfTimesToPlay; plays++) {
        debugLog('');
        runnerDebug(`Playing game ${plays + 1}`.red);
        try {
            const record = singleGame(state);
            history.push(record);
        } catch (e) {
            if (e instanceof InsuficientFundsError) {
                break;
            }

            console.error(e);
        }
    }

    return history;
}

function computeFinalResults(endedWithCash) {
    const gamesWon = endedWithCash.reduce((acc, cash) => (cash > 100 ? acc.concat(cash) : acc), []);
    const formattedGamesWon = gamesWon.reduce((acc, cash) => acc.concat(`$${cash}`), []);

    const gamesLost = endedWithCash.reduce((acc, cash) => (cash <= 100 ? acc.concat(-1 * (100 - cash)) : acc), []);
    const formattedGamesLost = gamesLost.reduce((acc, cash) => acc.concat(`-$${cash}`), []);

    const finalResult = endedWithCash.reduce((total, cash) => {
        if (cash < 100) {
            return total - (100 - cash);
        }

        return total + cash;
    });

    const finalResultString = finalResult > 0 ? `$${finalResult}` : `-$${finalResult * -1}`;

    console.log(`Number of games that went positive: ${gamesWon.length} (average winnings: $${findAverage(gamesWon).toFixed(2)})`);
    if (formattedGamesWon.length) {
        console.log(`Final cash stacks: ${formattedGamesWon.join(', ')}\n`);
    }

    console.log(`Number of games went negative: ${gamesLost.length} (average losses: -$${findAverage(gamesLost).toFixed(2).replace('-', '')})`);
    if (formattedGamesLost.length) {
        console.log(`Final cash stacks: ${formattedGamesLost.join(', ')}\n`);
    }

    console.log('Grand Total Earned:'.rainbow, `${finalResultString}`);
}


process.env.debug = true;
const endedWithCash = [];
const startingCash = 100;
const numberOfRuns = 100;
const simulationHistory = [];

for (let instance = 0; instance < numberOfRuns; instance++) {
    const tableInstance = new Table({
        tableMinimumBet: 5,
        tableMaximumBet: 5 * 100,
    });
    const playerInstance = new Player({ cash: startingCash });

    const record = runner({
        tableState: tableInstance,
        playerState: playerInstance,
    }, 100);

    simulationHistory.push(record);
    endedWithCash.push(playerInstance.cash);
}

// fs.writeFileSync('./simulation-record/results.json', JSON.stringify(simulationHistory));
computeFinalResults(endedWithCash);
