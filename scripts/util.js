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

//Get games for which all players in the playerNames array have participated in
function getGamesForPlayers(playerNames) {
	var gamesIncludingAllPlayers = [];
	for (var i = 0; i<games.length; i++) {
		var tmpPlayers = [];
		for (var j = 0; j<games[i].players.length; j++) {
			tmpPlayers.push(games[i].players[j].name);
		}
		var expectedLength = playerNames.length;
		var actualLength = intersectArrays(playerNames, tmpPlayers).length;
		if (expectedLength == actualLength) {
			gamesIncludingAllPlayers.push(games[i]);
		}
	}
	return gamesIncludingAllPlayers;
}

//Return the intersection of 2 arrays
function intersectArrays(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
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