// A Deck instance is comprised of 81 unique Cards
class Deck {
	constructor() {
		// generate and shuffle a new deck
		this.deck = Deck.generateDeck();
		this.shuffleDeck();

		// init tracker for deck iteration
		this.nextCardIndex = 66;
	}

	/* ------INSTANCE METHODS------ */

	// returns true if there are more, unused cards left in the deck
	hasNext() {
		return this.nextCardIndex < 81;
	}

	// Returns the next card in the deck
	// Increments counter
	next() {
		return this.deck[this.nextCardIndex++];
	}

	// shuffles an existing deck
	shuffleDeck() {
		let tempDeck = this.deck;
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[tempDeck[i], tempDeck[j]] = [tempDeck[j], tempDeck[i]];
		}
		this.deck = tempDeck;
	}

	/* -------CLASS METHODS------- */

	// generates a new ordered deck
	static generateDeck() {
		// declare new deck to be filled.
		let newDeck = [];
		// generate every combination of card properties
		for (let color in Colors) {
			for (let shape in Shapes) {
				for (let shading in Shadings) {
					for (let number = 1; number <= 3; number++) {
						// push new card onto deck
						newDeck.push(new Card(color, shape, shading, number));
					}
				}
			}
		}
		// return the newly generated deck
		return newDeck;
	}

	// shuffles an arbitrary array
	// returns the newly shuffled array
	static shufflePartialDeck(partialDeck) {
		for (let i = partialDeck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[partialDeck[i], partialDeck[j]] = [partialDeck[j], partialDeck[i]];
		}
		return partialDeck;
	}
}