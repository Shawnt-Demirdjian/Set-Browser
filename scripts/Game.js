// Holds all information for a single game and its current state
class Game {
	constructor(playerCount, keys) {
		this.playerCount = playerCount || 1; // defaults to single player
		this.playerKeys = keys; // the keys that belong to each player in order
		this.playerScores = [0, 0, 0, 0]; // player scores in order
		this.gameDeck = new Deck();
		this.workingSet = []; // the currently selected set (index only)
		this.table = []; // the cards currently on the table (index only)
	}

	/* ------INSTANCE METHODS------ */

	// returns true if the cards in workingSet are a valid Set, false otherwise
	// remove cards from table if valid
	// rules of what makes a set: https://www.setgame.com/sites/default/files/instructions/SET%20INSTRUCTIONS%20-%20ENGLISH.pdf
	checkSet() {
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
						return true;
					}
				}
			}
		}
		// some test failed
		return false;
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
		return newAdditions;
	}

	// Generates all combinations of cards on table
	// tests until we hit a working combination or finish
	// returns true if there exists a SET, false otherwise
	isPossible() {
		let allCombinations = Combinatorics.combination(this.table, 3);
		let currentCombo = [];
		while (currentCombo = allCombinations.next()) {
			if (Card.checkArbitrarySet([this.gameDeck.deck[currentCombo[0]], this.gameDeck.deck[currentCombo[1]], this.gameDeck.deck[currentCombo[2]]])) {
				return true;
			}
		}
		return false;
	}

	// returns true if game should end
	testEndgame() {
		// game ends if the deck is empty and there are no possible SETs
		return (!this.gameDeck.hasNext() && !this.isPossible())
	}

	// shuffles the table array
	// returns the newly shuffled array
	shuffleTable() {
		return Deck.shufflePartialDeck(this.table);
	}
}