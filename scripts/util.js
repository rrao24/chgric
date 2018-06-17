/**Module for utility functions related to building charts **/

//Returns array of names of players who have won a game
function getWinnersUnique() {
	var winners = [];
	var names = Object.keys(playerToScoreArrayDict);
	for (var q = 0; q<names.length; q++) {
		if (gameWinners.indexOf(names[q]) > 0) {
			winners.push(names[q]);
		}
	}
	return winners;
}

//Returns dictionary of names of player to number of wins
function getWinsByPlayer() {
	var winsByPlayer = {};
	for (var k = 0; k < gameWinners.length; k++) {
		if (!winsByPlayer[gameWinners[k]]) {
			winsByPlayer[gameWinners[k]] = 1;
		} else {
			winsByPlayer[gameWinners[k]]++;
		}
	}
	return winsByPlayer;
}

//Return array of colors equivalent to length of array passed in
function getBackgroundColors(arr) {
	var colors = [];
	for (var x = 0; x<arr.length; x++) {
		colors.push(backgroundColors[x]);
	}
	return colors;
}

//Generate x-axis labels for appropriate number of games
function getLabelsPerGame(games) {
	var xLabels = [];
	for (var q = 0; q<games.length; q++) {
		var v = q+1;
		xLabels.push("Game #" + v);
	}
	console.log('here');
	return xLabels;
}

//Get array of scores associated with a player
function getScoresForPlayer(player) {
	var scores = [];
	for (var y = 0; y<playerToScoreArrayDict[player].length; y++) {
		scores.push(playerToScoreArrayDict[player][y].score);
	}
	return scores;
}

//Get winner, max score, average score of game object
function deriveStats(game, gameWinners) {
	var maxScore = 0;
	var avgScore = 0;
	var winner = "";
	for (var j = 0; j < game.players.length; j++) {
		if (game.players[j].total > maxScore) {
			maxScore = game.players[j].total;
			winner = game.players[j].name;
		}
		avgScore += game.players[j].total;
	}
	avgScore = avgScore / game.players.length;
	avgScore = avgScore.toFixed(2);
	game.maxScore = maxScore;
	game.winner = winner;
	game.avgScore = avgScore;

	//Update gameWinners dictionary
	gameWinners.push(winner);

	return game;
}