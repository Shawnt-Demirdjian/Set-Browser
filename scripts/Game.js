// Holds all information for a single game and its current state
class Game {
	constructor(playerCount, keys, endGameCB) {
		this.playerCount = playerCount || 1; // defaults to single player
		this.playerKeys = keys; // the keys that belong to each player in order
		this.playerScores = []; // player scores in order
		this.playerScores.length = playerCount; // initialize playerScores array to be only as long as we have players
		this.playerScores.fill(0); // initialize all player scores to zero
		this.gameDeck = new Deck();
		this.workingSet = []; // the currently selected set (index only)
		this.table = []; // the cards currently on the table (index only)
		this.endGameCB = endGameCB; // the function to be called when the game is finished
		this.isGameDone = false; // ensures endGameCB is only called once
	}

	/* ------INSTANCE METHODS------ */

	// returns true if the cards in workingSet are a valid Set, false otherwise
	// remove cards from table if valid
	// rules of what makes a set: https://www.setgame.com/sites/default/files/instructions/SET%20INSTRUCTIONS%20-%20ENGLISH.pdf
	testWorkingSet() {
		// check number of cards
		if (this.workingSet.length !== 3) {
			return false;
		}
		// get the 3 cards to be compared
		let cards = [
			this.gameDeck.deck[this.workingSet[0]],
			this.gameDeck.deck[this.workingSet[1]],
			this.gameDeck.deck[this.workingSet[2]]
		];

		let result = false;

		if ((cards[0].number === cards[1].number && cards[1].number === cards[2].number) ||
			(cards[0].number !== cards[1].number && cards[1].number !== cards[2].number && cards[0].number !== cards[2].number)) {
			// number passes
			if ((cards[0].color === cards[1].color && cards[1].color === cards[2].color) ||
				(cards[0].color !== cards[1].color && cards[1].color !== cards[2].color && cards[0].color !== cards[2].color)) {
				// color passes
				if ((cards[0].shape === cards[1].shape && cards[1].shape === cards[2].shape) ||
					(cards[0].shape !== cards[1].shape && cards[1].shape !== cards[2].shape && cards[0].shape !== cards[2].shape)) {
					// shape passes
					if ((cards[0].shading === cards[1].shading && cards[1].shading === cards[2].shading) ||
						(cards[0].shading !== cards[1].shading && cards[1].shading !== cards[2].shading && cards[0].shading !== cards[2].shading)) {
						// shading passes
						// all tests pass, this is a set.
						// remove the working set from table
						this.table.splice(this.table.indexOf(parseInt(this.workingSet[0])), 1);
						this.table.splice(this.table.indexOf(parseInt(this.workingSet[1])), 1);
						this.table.splice(this.table.indexOf(parseInt(this.workingSet[2])), 1);
						result = true;
					}
				}
			}
		}
		if (this.testEndgame() && !this.isGameDone) {
			// fire endGame
			this.isGameDone = true;
			this.endGameCB();
		}
		return result;
	}

	// fills table with first 12 cards
	startGame() {
		let startingCards = this.addCardsToTable(12);
		// TODO: init some player things
		return startingCards;
	}

	// adds n cards to table, if they are available
	// returns array of n objects that contain a card and their index that were just added to table
	// returns empty array on endgame
	addCardsToTable(n) {
		let newAdditions = [];
		for (let i = 0; i < n && this.gameDeck.hasNext(); i++) {
			newAdditions.push({
				card: this.gameDeck.next(),
				index: this.gameDeck.nextCardIndex - 1
			});
			this.table.push(this.gameDeck.nextCardIndex - 1);
		}
		if (this.testEndgame() && !this.isGameDone) {
			// fire endGame
			this.isGameDone = true;
			this.endGameCB();
		}
		return newAdditions;
	}

	// Generates all combinations of cards on table
	// tests until we hit a working combination or finish
	// returns valid SET if there exists a SET, false otherwise
	isPossible() {
		let allCombinations = Combinatorics.combination(this.table, 3);
		let currentCombo = [];
		while (currentCombo = allCombinations.next()) {
			if (Card.checkArbitrarySet([this.gameDeck.deck[currentCombo[0]], this.gameDeck.deck[currentCombo[1]], this.gameDeck.deck[currentCombo[2]]])) {
				return currentCombo;
			}
		}
		return false;
	}

	// returns true if game should end
	testEndgame() {
		// game ends if the deck is empty and there are no possible SETs
		return (!this.gameDeck.hasNext() && this.isPossible() === false)
	}

	// shuffles the table array
	// returns the newly shuffled array
	shuffleTable() {
		return Deck.shufflePartialDeck(this.table);
	}

	/* GETTERS/SETTERS */

	// returns the number of players
	getPlayerCount() {
		return this.playerCount;
	}

	// returns key of player by index
	getPlayerKey(playerIndex) {
		if (playerIndex >= 0 && playerIndex < this.playerCount) {
			return this.playerKeys[playerIndex];
		}
		// TODO: error handle, bad input
	}

	// returns the index of player by their assigned key
	// returns -1 if key does not belong to player
	getPlayerIndex(playerKey) {
		return this.playerKeys.indexOf(playerKey);
	}

	// returns player scores array
	getPlayerScores() {
		return this.playerScores;
	}

	// decreases player score by 1
	// returns new score
	decrementPlayerScore(playerIndex) {
		if (playerIndex >= 0 && playerIndex < this.playerCount) {
			return --this.playerScores[playerIndex];
		}
		// TODO: error handle, bad input
	}

	// increases player score by 1
	// returns new score
	incrementPlayerScore(playerIndex) {
		if (playerIndex >= 0 && playerIndex < this.playerCount) {
			return ++this.playerScores[playerIndex];
		}
		// TODO: error handle, bad input
	}

	// checks if a card's index is in the workingSet
	// returns index of card in workingSet
	// returns -1 if not found
	isInWorkingSet(cardIndex) {
		if (cardIndex >= 0 && cardIndex < this.gameDeck.deck.length) {
			return this.workingSet.indexOf(cardIndex);
		}
		// TODO: error handle, bad input
	}

	// adds a card index to workingSet
	// returns true if successully added or already present
	// returns false if workingSet is full
	addToWorkingSet(cardIndex) {
		if (this.workingSet.length === 3) {
			// workingSet is full
			return false;
		}
		if (cardIndex >= 0 && cardIndex < this.gameDeck.deck.length) {
			if (this.isInWorkingSet(cardIndex) === -1) {
				this.workingSet.push(cardIndex);
			}
			return true;
		}
		// TODO: error handle, bad input
	}

	// removes a card index from workingSet
	// returns true if successfully removed
	// returns false if not present
	removeFromWorkingSet(cardIndex) {
		if (cardIndex >= 0 && cardIndex < this.gameDeck.deck.length) {
			let cardIndexInWorkingSet = this.isInWorkingSet(cardIndex);
			if (cardIndexInWorkingSet !== -1) {
				this.workingSet.splice(cardIndexInWorkingSet, 1);
				return true;
			}
			return false;
		}
		// TODO: error handle, bad input
	}

	// returns the length of the workingSet
	getWorkingSetLength() {
		return this.workingSet.length;
	}

	// empties the workingSet
	clearWorkingSet() {
		this.workingSet.length = 0;
	}

	// returns the length of the table
	getTableLength() {
		return this.table.length;
	}

}