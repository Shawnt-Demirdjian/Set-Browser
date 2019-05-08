$(document).ready(() => {

	// generate a new deck
	let gameDeck = new Deck();
	let workingSet = [];

	// Display first 12 cards
	for (gameDeck.nextCardIndex; gameDeck.nextCardIndex < 12; gameDeck.nextCardIndex++) {
		let card = gameDeck.deck[gameDeck.nextCardIndex];
		$("#cards").append(`<div class="card" data-cardIndex=${gameDeck.nextCardIndex}>${card.color}<br>${card.shape}<br>${card.shading}<br>${card.number}</div>`);
		$(".card").last().css("border-color", card.color);
	}

	// clicking on cards
	// toggle active styling and add to workingSet
	// max of three selected
	$("#cards").on("click", ".card", (e) => {
		// get the index of the card the selected
		let selectedCardIndex = $(e.target).attr("data-cardIndex");
		// get the index of the card in the workingSet (if selected already)
		let selectedIndex = workingSet.indexOf(selectedCardIndex);
		if (selectedIndex === -1 && workingSet.length !== 3) {
			// select
			// make active and push onto workingSet
			$(e.target).addClass("card-active");
			workingSet.push(selectedCardIndex);
		} else if (selectedIndex !== -1) {
			// deselect
			// remove active and remove from workingSet
			$(e.target).removeClass("card-active");
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
	$("#check-set-btn").click((e) => {
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
		for (let i = 0; i < 3; i++) {
			let card = gameDeck.deck[gameDeck.nextCardIndex];
			$("#cards").append(`<div class="card" data-cardIndex=${gameDeck.nextCardIndex++}>${card.color}<br>${card.shape}<br>${card.shading}<br>${card.number}</div>`);
			$(".card").last().css("border-color", card.color);
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