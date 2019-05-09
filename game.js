$(document).ready(() => {

	// generate a new deck
	let gameDeck = new Deck();
	let workingSet = [];

	// Display first 12 cards
	addCards(12);

	// clicking on cards
	// toggle active styling and add to workingSet
	// max of three selected
	$("#table").on("click", ".card-cover", (e) => {
		let targetCard = $(e.target).parent(".card");
		// get the index of the card the selected
		let selectedCardIndex = targetCard.attr("data-cardIndex");
		// get the index of the card in the workingSet (if selected already)
		let selectedIndex = workingSet.indexOf(selectedCardIndex);
		if (selectedIndex === -1 && workingSet.length !== 3) {
			// select
			// make active and push onto workingSet
			targetCard.addClass("card-active");
			workingSet.push(selectedCardIndex);
		} else if (selectedIndex !== -1) {
			// deselect
			// remove active and remove from workingSet
			targetCard.removeClass("card-active");
			workingSet.splice(selectedIndex, 1);
		}

		// Show/hide "Check Set" button based on number of cards selected
		if (workingSet.length === 3) {
			$("#check-set").css('visibility', 'visible');
		} else {
			$("#check-set").css('visibility', 'hidden');
		}
	});

	// Check if workingSet is correct
	// announce result
	// add new cards if necessary
	$("#check-set-btn").on("click", (e) => {
		let result = checkSet([gameDeck.deck[workingSet[0]], gameDeck.deck[workingSet[1]], gameDeck.deck[workingSet[2]]]);

		if (result) {
			// is a valid set
			setAnnouncement("SET!");
			replaceCards();
			clearWorkingSet();
		} else {
			// not a valid set
			setAnnouncement("Wrong!");
			clearWorkingSet();
		}

		$("#check-set").css('visibility', 'hidden');
	});

	// removes cards in workingSet from table
	// adds next 3 cards from deck
	function replaceCards() {
		workingSet.forEach(element => {
			$(`.card[data-cardIndex=${element}]`).remove();
		});
		addCards(3);
	}

	// adds cards to the table
	// defaults to 1 card
	function addCards(number) {
		for (let i = 0; i < number; i++) {
			let card = gameDeck.deck[gameDeck.nextCardIndex];
			let cardElement = `<div class="card card-${card.color}" data-cardIndex=${gameDeck.nextCardIndex}>`;
			for (let i = 0; i < card.number; i++) {
				cardElement += `<img class="shape" src="images/${card.shape}/${card.shading}/${card.color}.svg">`;
			}
			cardElement += "<div class='card-cover'></div></div>";
			gameDeck.nextCardIndex++;
			$("#table").append(cardElement);
		}
	}

	// clears the workingSet and deselects all cards
	function clearWorkingSet() {
		workingSet.forEach(element => {
			$(`.card[data-cardIndex=${element}]`).removeClass("card-active");
		});
		workingSet.length = 0;
	}

	// sets announcement header and makes visible for set time
	function setAnnouncement(text, time) {
		$("#announcement").text(text);
		$("#announcement").css('visibility', 'visible');
		setTimeout(() => {
			$("#announcement").css('visibility', 'hidden');
		}, time || 1000);
	}

}); // end document.ready