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

		// Show/hide "Test Selected" button based on number of cards selected
		if (workingSet.length === 3) {
			$("#check-set").removeClass("disabled");
			$("#check-set").attr("disabled", false);
		} else {
			$("#check-set").addClass("disabled");
			$("#check-set").attr("disabled", true);
		}
	});

	// add 3 new cards to table
	// disable add cards button
	$("#add-cards").on("click", (e) => {
		addCards(3);
		$("#add-cards").addClass("disabled");
		$("#add-cards").attr("disabled", true);
		$("#table").addClass("large-table");
	});

	// Check if workingSet is correct
	// announce result
	// add new cards if necessary
	$("#check-set").on("click", (e) => {
		let result = checkSet([gameDeck.deck[workingSet[0]], gameDeck.deck[workingSet[1]], gameDeck.deck[workingSet[2]]]);
		if (result) {
			// is a valid set
			setAnnouncement(true);
			removeCards();
			if ($("#table .card").length <= 9) {
				// Only replace cards if extra 3 weren't added
				addCards(3);
			} else {
				$("#add-cards").removeClass("disabled");
				$("#add-cards").attr("disabled", false);
				$("#table").removeClass("large-table");
			}
			clearWorkingSet();
		} else {
			// not a valid set
			setAnnouncement(false);
			clearWorkingSet();
		}

		$("#check-set").addClass("disabled");
		$("#check-set").attr("disabled", true);
	});

	// removes cards in workingSet from table
	// adds next 3 cards from deck
	function removeCards() {
		workingSet.forEach(element => {
			$(`.card[data-cardIndex=${element}]`).remove();
		});
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
	function setAnnouncement(valid, time) {
		if (valid) {
			$("#announcement").addClass('valid-color');
			$("#announcement").removeClass('invalid-color');
			$("#announcement").text("Correct!");
		} else {
			$("#announcement").addClass('invalid-color');
			$("#announcement").removeClass('valid-color');
			$("#announcement").text("Wrong!");
		}
		$("#announcement").css('visibility', 'visible');
		setTimeout(() => {
			$("#announcement").css('visibility', 'hidden');
		}, time || 1000);
	}

}); // end document.ready