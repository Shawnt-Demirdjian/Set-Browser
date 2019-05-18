$(document).ready(() => {

	// game reference
	let game;

	// timer reference
	let timer;
	let maxTimeout;

	/* ------------EVENTS------------ */

	// "X Player" Buttons
	// Starts game with X amount of players
	$(".start-btn").on("click", (e) => {
		// generate new game with requested players
		let playerCount = parseInt($(e.target).attr("data-playerCount"));
		let keys = [];
		switch (playerCount) {
			case 1:
				keys = ["Space"];
				break;
			case 2:
				keys = ["KeyA", "KeyL"];
				break;
			case 3:
				keys = ["KeyQ", "KeyB", "BracketRight"];
				break;
			case 4:
				keys = ["KeyQ", "KeyC", "KeyM", "BracketRight"];
				break;
		}
		game = new Game($(e.target).attr("data-playerCount"), keys);

		if (playerCount > 1) {
			multiPlayerSetUp();
		} else {
			singlePlayerSetUp();
		}

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
			let newlyAdded = game.addCardsToTable(3);
			renderCardsToTable(newlyAdded);
			$("#add-cards").addClass("disabled");
			$("#add-cards").attr("disabled", true);
			$("#table").addClass("large-table");
			if (game.testEndgame()) {
				endgame();
			}
		}
	});

	// "Is it Possible?" Button
	// announce result
	$("#is-possible").on("click", (e) => {
		// isPossible returns array on success
		if (game.isPossible() === false) {
			setPossible(false);
		} else {
			setPossible(true);
		}
	});

	// "X constant button"
	// cancel game and revert to main menu
	$(".exit").on("click", () => {
		// reset table
		$("#table").empty();
		$("#table").removeClass("large-table");

		// reset score board
		$("#score-board").empty();

		// reset game buttons
		$("#check-set").addClass("disabled");
		$("#check-set").attr("disabled", true);
		$("#add-cards").removeClass("disabled");
		$("#add-cards").attr("disabled", false);

		// reset card click event
		$("#table").off("click", ".card-cover");

		// reset game
		game = null;

		// Hide game, hide endgame, hide and reset player scores, show menu
		$("#table").addClass("display-none");
		$("#game-buttons").addClass("display-none");
		$("#main-menu").removeClass("display-none");
		$("#endgame-background").addClass("display-none");
		$(".constant-score").css('visibility', 'hidden');
		$(".points").text("0 Points");
	});

	// "Shuffle" Button
	// Reorder the cards on the table
	$("#shuffle-table").on("click", () => {
		// shuffle table
		let newOrder = game.shuffleTable();

		// reorder Board
		newOrder.forEach((newIndex) => {
			$("#table").append($(`.card[data-cardIndex=${newIndex}]`));
		});
	});

	// "Give Up" button
	// Auto select a valid SET
	// Add more cards if necessary
	$("#give-up").on("click", () => {
		let validSet = game.isPossible();
		if (validSet === false) {
			// there was no valid SET
			// add more cards and try again
			$("#add-cards").trigger("click");
			validSet = game.isPossible();
		}

		// select the SET
		validSet.forEach((index) => {
			$(`.card[data-cardIndex=${index}]`).children(".card-cover").trigger("click");
		});
	});

	/* ----------EVENT FUNCTIONS---------- */

	// "Test Selected" Button for Single Player
	// Check if workingSet is valid,
	// announce result, add more cards,
	// enable, "Add More Cards", Disable "Test Selected",
	// clear workingSet
	function singlePlayerCheckSet(e) {
		let result = game.checkSet();
		if (result) {
			// is a valid set
			setAnnouncement("Correct!", true);
			removeCards();
			if (game.table.length <= 9) {
				// Only replace cards if extra 3 weren't added
				let newlyAdded = game.addCardsToTable(3);
				renderCardsToTable(newlyAdded);
			}
			if (game.gameDeck.hasNext()) {
				// re-enable "Add More Cards" if there are more to add
				$("#add-cards").removeClass("disabled");
				$("#add-cards").attr("disabled", false);
			} else {
				// disable "Add More Cards"
				$("#add-cards").addClass("disabled");
				$("#add-cards").attr("disabled", true);
			}
			$("#table").removeClass("large-table");
			clearWorkingSet();
		} else {
			// not a valid set
			setAnnouncement("Wrong!", false);
			clearWorkingSet();
		}
		$("#check-set").addClass("disabled");
		$("#check-set").attr("disabled", true);
		if (game.testEndgame()) {
			endgame();
		}
	}

	function multiPlayerCheckSet(e) {
		let result = game.checkSet();
		clearSet();
		if (result) {
			// increment player score
			game.playerScores[game.currentPlayer]++;
			// is a valid set
			setAnnouncement("Correct!", true);
			removeCards();
			if (game.table.length <= 9) {
				// Only replace cards if extra 3 weren't added
				let newlyAdded = game.addCardsToTable(3);
				renderCardsToTable(newlyAdded);
			}
			if (game.gameDeck.hasNext()) {
				// re-enable "Add More Cards" if there are more to add
				$("#add-cards").removeClass("disabled");
				$("#add-cards").attr("disabled", false);
			} else {
				// disable "Add More Cards"
				$("#add-cards").addClass("disabled");
				$("#add-cards").attr("disabled", true);
			}
			$("#table").removeClass("large-table");
			clearWorkingSet();
		} else {
			// decrement player score
			game.playerScores[game.currentPlayer]--;
			// not a valid set
			setAnnouncement("Wrong!", false);
			clearWorkingSet();
		}
		updateScore(game.currentPlayer);
		// reset current player
		game.currentPlayer = -1;
		$("#check-set").addClass("disabled");
		$("#check-set").attr("disabled", true);
		if (game.testEndgame()) {
			endgame();
		}
	}

	// Clicking on Cards for Single Player
	// toggle active styling and add to workingSet
	// max of three selected
	function cardClick(e) {
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
	}

	// deals with keydown event in multiplayer games
	function callSet(e) {
		if (game.currentPlayer !== -1) {
			// some player has already called set
			return;
		}
		// No player has called set yet
		game.currentPlayer = game.playerKeys.indexOf(e.code);
		if (game.playerKeys.indexOf(e.code) === -1) {
			// no player assigned to this key
			return;
		}
		// run timer
		let time = 1000;
		timer = setInterval(() => {
			$("#announcement").removeClass('invalid-color valid-color');
			$("#announcement").css('visibility', 'visible');
			$("#announcement").text((time / 100).toFixed(1));
			time -= 10;
		}, 100);

		// clear set it 10 seconds
		maxTimeout = setTimeout(() => {
			// loose a point, they ran out of time
			game.playerScores[game.currentPlayer]--;
			updateScore(game.currentPlayer);

			// announce out of time
			setAnnouncement("Out of Time!", false);

			// reset currentPlayer
			game.currentPlayer = -1;

			// deselect all cards
			clearWorkingSet();

			clearSet();
		}, 10000);
	}

	/* ----------HELPER FUNCTIONS---------- */

	// set up event triggers appropriate for single player
	function singlePlayerSetUp() {
		$("#give-up").css("display", "block");

		$("#check-set").on("click", singlePlayerCheckSet);
		$("#table").on("click", ".card-cover", cardClick);
	}

	// set up event triggers appropriate for multiplayer
	function multiPlayerSetUp() {
		$("#give-up").css("display", "none");

		// show player scores
		for (let playerIndex = 0; playerIndex < game.playerCount; playerIndex++) {
			$($(".constant-score").get(playerIndex)).css('visibility', 'visible');
		}

		$("#check-set").on("click", multiPlayerCheckSet);
		$("#table").on("click", ".card-cover", (e) => {
			if (game.currentPlayer !== -1) {
				// someone called set
				cardClick(e);
			}
		});
		$(document).on("keypress", callSet);
	}

	// updates the displayed score for the player index given
	function updateScore(playerIndex) {
		$($(".constant-score").get(playerIndex)).children(".points").text(`${game.playerScores[playerIndex]} Points`);
	}

	// clears timer and interval
	// reset "Test Selected" button
	function clearSet() {
		clearInterval(timer);
		clearTimeout(maxTimeout);

		$("#check-set").addClass("disabled");
		$("#check-set").attr("disabled", true);
	}

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
	function setAnnouncement(text, valid, time) {
		console.log(text);

		if (valid) {
			$("#announcement").addClass('valid-color');
			$("#announcement").removeClass('invalid-color');
		} else {
			$("#announcement").addClass('invalid-color');
			$("#announcement").removeClass('valid-color');
		}
		$("#announcement").text(text);
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

	// Stop game and display Endgame Modal 
	// game ends if the deck is empty and there are no possible SETs
	function endgame() {
		for (let playerIndex = 0; playerIndex < game.playerCount; playerIndex++) {
			$("#score-board").append(
				`<tr class="score">
					<td>Player ${playerIndex}</td>
					<td>${game.playerScores[playerIndex]} Points</td>
				</tr>`
			);
		}
		// show Endgame Modal
		$("#endgame-background").removeClass("display-none");
	}

}); // end document.ready