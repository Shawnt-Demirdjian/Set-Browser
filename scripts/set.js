const Colors = {
	RED: Symbol('RED'),
	PURPLE: Symbol('PURPLE'),
	GREEN: Symbol('GREEN'),
};

const Shapes = {
	OVAL: Symbol('OVAL'),
	SQUIGGLE: Symbol('SQUIGGLE'),
	DIAMOND: Symbol('DIAMOND'),
};

const Shadings = {
	SOLID: Symbol('SOLID'),
	STRIPED: Symbol('STRIPED'),
	OUTLINED: Symbol('OUTLINED'),
};

class Card {
	// expects color, shape, and shading to of types above
	constructor(color, shape, shading, number) {
		this.color = color;
		this.shape = shape;
		this.shading = shading;
		this.number = number;
	}
}

class Deck {
	constructor() {
		// generate and shuffle a new deck
		this.deck = this.generateDeck();
		this.shuffleDeck();

		// init tracker for deck usage
		this.nextCardIndex = 0;
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

	// generates a new ordered deck
	generateDeck() {
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
}

// expects and array of exactly three unique cards
// returns true if these cards are a valid Set, false otherwise
// A set is defined so that all three cards are either
// equivalent or different for each property
function checkSet(cards) {
	// check number of cards
	if (cards.length !== 3) {
		return false;
	}

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
					return true;
				}
			}
		}
	}
	// some test failed
	return false;
}