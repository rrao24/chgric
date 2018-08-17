/** Module for utility functions related to building charts **/

//LOL

//Returns array of names of players who have won a game
function getWinnersUnique() {
	var winners = [];
	for (var q = 0; q<gameWinners.length; q++) {
		for (var r = 0; r<gameWinners[q].length; r++) {
			if (winners.indexOf(gameWinners[q][r]) < 0) {
				winners.push(gameWinners[q][r]);
			}
		}
	}
	return winners;
}

//Returns dictionary of names of player to number of wins
function getWinsByPlayer() {
	var winsByPlayer = {};
	for (var k = 0; k < gameWinners.length; k++) {
		for (var l = 0; l < gameWinners.length; l++) {
			if (!winsByPlayer[gameWinners[k][l]]) {
				winsByPlayer[gameWinners[k][l]] = 1;
			} else {
				winsByPlayer[gameWinners[k][l]]++;
			}
		}
	}
	return winsByPlayer;
}

//Return array of colors equivalent to length of array passed in
function getBackgroundColors(arr) {
	backgroundColors = shuffle(backgroundColors);
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
		var v = games[q].gameNumber;
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

//Get array of scores for players over certain games
function getScoresForPlayersOverGames(players, games) {
	var scoresDict = {};
	for (var i = 0; i < players.length; i++) {
		scoresDict[players[i]] = [];
	}
	for (var j = 0; j < games.length; j++) {
		for (var k = 0; k < games[j].players.length; k++) {
			if (scoresDict[games[j].players[k].name]) {
				scoresDict[games[j].players[k].name].push(games[j].players[k].total);
			}
		}
	}
	return scoresDict;
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

//Get running average of an array of scores
function getRunningAverage(scoresArr) {
	var runningAvgArr = [];
	var runningCount = 0;
	for (var i = 0; i < scoresArr.length; i++) {
		var divideBy = i + 1;
		runningCount += scoresArr[i];
		var runningAvg = runningCount / divideBy;
		runningAvgArr.push(runningAvg.toFixed(2));
	}
	return runningAvgArr;
}

//Get game by game number
function getGameByGameNumber(gameNumber) {
	for (var i = 0; i < games.length; i++) {
		if (games[i].gameNumber == gameNumber) {
			return games[i];
		}
	}
	return;
}

//Function to be called when creating custom legend
function legendCallback(chart) {
	var text = [];
	text.push('<ul class="0-legend">');
	for (var i = 0; i < chart.data.datasets.length; i++) {
		text.push('<li><span style="background-color:' 
			+ chart.data.datasets[i].backgroundColor + '"></span>');
		if (chart.data.datasets[i].label) {
			text.push(chart.data.datasets[i].label);
		}
		text.push('</li>');
	}
	text.push('<li><span style="background-color:yellow"></span>Win</li>');
	text.push('</ul>'); 
	return text.join('');
}

//Get winners, max score, average score of game object
function deriveStats(game, gameWinners) {
	var maxScore = 0;
	var avgScore = 0;
	var winners = [];
	for (var j = 0; j < game.players.length; j++) {
		if (game.players[j].total > maxScore) {
			maxScore = game.players[j].total;
		}
		avgScore += game.players[j].total;
	}
	for (var k = 0; k < game.players.length; k++) {
		if (game.players[k].total == maxScore) {
			winners.push(game.players[k].name);
		}
	}
	avgScore = avgScore / game.players.length;
	avgScore = avgScore.toFixed(2);
	game.maxScore = maxScore;
	game.winners = winners;
	game.avgScore = avgScore;

	//Update gameWinners dictionary
	gameWinners.push(winners);

	return game;
}
