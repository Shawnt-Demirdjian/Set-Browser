$(document).ready(() => {

	// game reference
	let game;

	/* ------------EVENTS------------ */

	// "X Player" Buttons
	// Starts game with X amount of players (1 for now)
	$(".start-btn").on("click", (e) => {
		// generate new game with requested players (1 for now)
		game = new Game($(e.target).attr("data-playerCount"));
		// start the game and fill the table
		renderCardsToTable(game.startGame());

		// Hide menu, show game
		$("#main-menu").addClass("display-none");
		$("#table").removeClass("display-none");
		$("#game-buttons").removeClass("display-none");
	});

	// "Add More Cards" button
	// add 3 new cards to table if available
	// disable add cards button
	$("#add-cards").on("click", (e) => {
		if (game.gameDeck.hasNext() && game.table.length <= 12) {
			renderCardsToTable(game.addCardsToTable(3));
		}
		$("#add-cards").addClass("disabled");
		$("#add-cards").attr("disabled", true);
		$("#table").addClass("large-table");
	});

	// "Test Selected" Button
	// Check if workingSet is valid,
	// announce result, add more cards,
	// enable, "Add More Cards", Disable "Test Selected",
	// clear workingSet
	$("#check-set").on("click", (e) => {
		let result = game.checkSet();
		if (result) {
			// is a valid set
			setAnnouncement(true);
			removeCards();
			if ($("#table .card").length <= 9) {
				// Only replace cards if extra 3 weren't added
				renderCardsToTable(game.addCardsToTable(3));
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

	// "Is it Possible?" Button
	// announce result
	$("#is-possible").on("click", (e) => {
		setPossible(game.isPossible());
	});

	// Clicking on Cards
	// toggle active styling and add to workingSet
	// max of three selected
	$("#table").on("click", ".card-cover", (e) => {
		let targetCard = $(e.target).parent(".card");
		// get the index of the card the selected
		let selectedCardIndex = targetCard.attr("data-cardIndex");
		// get the index of the card in the workingSet (if selected already)
		let selectedIndex = game.workingSet.indexOf(selectedCardIndex);
		if (selectedIndex === -1 && game.workingSet.length !== 3) {
			// select
			// make active and push onto workingSet
			targetCard.addClass("card-active");
			game.workingSet.push(selectedCardIndex);
		} else if (selectedIndex !== -1) {
			// deselect
			// remove active and remove from workingSet
			targetCard.removeClass("card-active");
			game.workingSet.splice(selectedIndex, 1);
		}

		// Show/hide "Test Selected" button based on number of cards selected
		if (game.workingSet.length === 3) {
			$("#check-set").removeClass("disabled");
			$("#check-set").attr("disabled", false);
		} else {
			$("#check-set").addClass("disabled");
			$("#check-set").attr("disabled", true);
		}
	});

	// "X constant button"
	// cancel game and revert to main menu
	$("#exit").on("click", () => {
		// reset table
		$("#table").empty();
		$("#table").removeClass("large-table");

		// reset game buttons
		$("#check-set").addClass("disabled");
		$("#check-set").attr("disabled", true);
		$("#add-cards").removeClass("disabled");
		$("#add-cards").attr("disabled", false);

		// reset game
		game = null;

		// Hide game, show menu
		$("#table").addClass("display-none");
		$("#game-buttons").addClass("display-none");
		$("#main-menu").removeClass("display-none");

	});

	/* ----------FUNCTIONS---------- */

	// renders an array of cards to the table
	// each object in the cards array contains their index and the card
	function renderCardsToTable(cardsArr) {
		cardsArr.forEach((element) => {
			let cardElement = `<div class="card card-${element.card.color}" data-cardIndex=${element.index}>`;
			for (let i = 0; i < element.card.number; i++) {
				cardElement += `<img class="shape" src="images/${element.card.shape}/${element.card.shading}/${element.card.color}.svg">`;
			}
			cardElement += "<div class='card-cover'></div></div>";
			$("#table").append(cardElement);
		});
	}

	// removes cards in workingSet from table
	function removeCards() {
		game.workingSet.forEach(element => {
			$(`.card[data-cardIndex=${element}]`).remove();
		});
	}

	// clears the workingSet and deselects all cards
	function clearWorkingSet() {
		game.workingSet.forEach(element => {
			$(`.card[data-cardIndex=${element}]`).removeClass("card-active");
		});
		game.workingSet.length = 0;
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

	// sets is Possible result and reverts after set time
	function setPossible(valid, time) {
		if (valid) {
			$("#is-possible").text("YES");
			$("#is-possible").addClass("valid-color");
		} else {
			$("#is-possible").text("NO");
			$("#is-possible").addClass("invalid-color");
		}
		setTimeout(() => {
			$("#is-possible").removeClass("invalid-color valid-color");
			$("#is-possible").text("Is it Possible?");
		}, time || 1000);
	}

}); // end document.ready