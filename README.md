# Craps Simulator

Craps simulator automates both sides of a standard craps table - both the player and the dealer. The player is automated via a user-created algorithm, to allow anyone to fine-tune their betting strategies while playing craps.

## Player Algorithm Creation

Currently, the automated player's algorithm is stored in `./betting-algorithm.js`. (This will change at some point to be an arbitrary user-defined file)

The betting algorithm given to the craps runner must export a function of the following signature:
```
module.exports = function someName(dispatch, state) {...}
```
This is a similar interpretation to redux/vuex/flux, the player actions are performed by dispatching a action/value pair.

For instance:

```
module.exports = function playerAlgorithm(dispatch, state) {
    const { playerState, tableState, gameState } = state;

    // The "Point" has not been set, and the player has not bet on the pass line
    if(!gameState.point && !gameState.passLine.initialBet) {

        // Bet the Pass Line, at the table's minimum bet
        dispatch('passLineBet', { amount: tableState.tableMinimumBet });
    }
}
```

This algorithm is run at the start of each round of play, before the dice are rolled.

### Command API
The following actions can currently be passed to `dispatch`. All values associated with these actions must be passed as a single object.

For Example:

 `dispatch('someAction', { foo: 123, bar: 'eh' })`

| Action | Arguments |
|--------|-----------|
| `passLineBet`| `amount` - The amount to bet on the pass line. Table minimums/maximums apply to this bet.|
| `passLineBackingBet` | `amount` - The amount to bet when backing a pass line bet. Table minimums/maximums apply to this bet.
