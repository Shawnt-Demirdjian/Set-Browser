// Represents a SET card
// Has only four properties
class Card {
	// expects color, shape, and shading to of types above
	constructor(color, shape, shading, number) {
		this.color = color;
		this.shape = shape;
		this.shading = shading;
		this.number = number;
	}

	/* -------CLASS METHODS------- */

	// expects and array of exactly three unique cards
	// returns true if these cards are a valid Set, false otherwise
	// A set is defined so that all three cards are either
	// equivalent or different for each property
	static checkArbitrarySet(cards) {
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
}