function buildPieChart(ctx) {
	//Rebuild graph options UI
	$('#playerSelect').empty();
	var chartOptionStr = 'Display <select id="chartOption" name="charts">';
	chartOptionStr += '<option value="--"--</option>';
	chartOptionStr += '<option value="Pie" selected="selected">Pie</option>';
	chartOptionStr += '<option value="Line">Line</option>';
	chartOptionStr += '</select> Graph';
	$('#playerSelect').append(chartOptionStr);

	//Store all player names who have won a game
	var xLabels = getWinnersUnique();

	//Get wins by each player, in order of xLabels
	var graphWins = [];
	var winsByPlayer = getWinsByPlayer();
	for (var y = 0; y<xLabels.length; y++) {
		graphWins.push(winsByPlayer[xLabels[y]]);
	}

	//Get as many background colors as players
	var graphColors = getBackgroundColors(xLabels);

	//Create chart
	chart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: xLabels,
			datasets: [{
				label: "Wins",
				backgroundColor: graphColors,
				data: graphWins
			}]
		}
	});
}

function generateLineChartOptions() {
	//Generate custom player options for line chart
	var playerOptionStr = ' For: <select id="playerOption" name="players">';
	playerOptionStr += '<option value="default">--</option>'
	var playerNames = Object.keys(playerToScoreArrayDict);
	for (var p = 0; p < playerNames.length; p++) {
		playerOptionStr += '<option value="' + playerNames[p] + '">' + playerNames[p] + '</option>';
	}
	playerOptionStr += '</select>';
	$('#playerSelect').append(playerOptionStr);
}

function generateMoreLineChartOptions() {
	//Generate custom additional options for line chart
	$('#against').remove();
	var playersOptionStr = ' <span id="against">Against: <select id="againstOption" name="players[]" size="5" multiple>';
	var playerNames = Object.keys(playerToScoreArrayDict);
	var doNotInclude = $('#playerOption').val();
	for (var p = 0; p < playerNames.length; p++) {
		if (playerNames[p] !== doNotInclude) {
			playersOptionStr += '<option value="' + playerNames[p] + '">' + playerNames[p] + '</option>';
		}
	}
	playersOptionStr += '</select></span>';
	$('#playerSelect').append(playersOptionStr);
	$('#againstOption').chosen();
}

function buildLineGraph(ctx, selectedPlayer) {
	//execute if change is legitimate
	if (selectedPlayer !== "default") {

    	//Create labels for each data point
		var xLabels = getLabelsPerGame(playerToScoreArrayDict[selectedPlayer]);

		//Get scores for selected player
		var graphScores = getScoresForPlayer(selectedPlayer);

		//Get running average
		var runningAverage = getRunningAverage(graphScores);

		//Make wins a different color
		var highlightedWinPointBackgroundColors = [];

		//Initialize chart with xLabels, graphScores
		chart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: xLabels,
		        datasets: [{
		            label: "Score",
		            fill: false,
		            pointBackgroundColor: highlightedWinPointBackgroundColors,
		            backgroundColor: 'rgb(255, 99, 132)',
		            borderColor: 'rgb(255, 99, 132)',
		            data: graphScores,
		        },
		        {
		        	label: "Running Average",
		        	fill: false,
		        	backgroundColor: 'rgb(255, 99, 132)',
		            borderColor: 'rgb(255, 99, 132)',
		            data: runningAverage
		        }]
		    },
		    options: {
		    	//Disable auto generated legend
		    	legend: {
		    		display: false
		    	},
		    	//Custom legend function
		    	legendCallback: function(chart) {
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
		    	},
		    	scales: {
		    		xAxes: [{
		    			display: false
		    		}]
		    	}
		    }
		});

		//Used to calculate win percentage
		var wins = 0;

		//get random background color
		var rndmColor = getBackgroundColors([""]);

		//Update chart with different colors for wins
		for (var x = 0; x<playerToScoreArrayDict[selectedPlayer].length; x++) {
			var currGame = playerToScoreArrayDict[selectedPlayer][x].gameNumber;
			if (gameWinners[currGame].indexOf(selectedPlayer) >= 0) {
				highlightedWinPointBackgroundColors.push("yellow");
				wins++;
			} else {
				highlightedWinPointBackgroundColors.push(rndmColor);
				chart.data.datasets[0].borderColor = rndmColor;
				chart.data.datasets[0].backgroundColor = rndmColor;
			}
		}
		chart.update();

		//Append custom legend
		$('#visualLegend').append(chart.generateLegend());

		//Display win percentage
		var winPct = (wins/(playerToScoreArrayDict[selectedPlayer].length)).toFixed(2);
		$('#winPct').append('Win Percentage: ' + winPct);
	}
}

function buildMultiLineGraph(ctx, initialPlayer, selectedPlayers) {
	//Get games
	selectedPlayers.push(initialPlayer);
	var games = getGamesForPlayers(selectedPlayers);
	//Store game numbers for which all selected players have participated in
	var gameNumbers = [];
	for (var i = 0; i < games.length; i++) {
		gameNumbers.push(games[i].gameNumber);
	}

	//Create labels for each data point
	var xLabels = getLabelsPerGame(games);

	//Different color for each player
	var graphColors = getBackgroundColors(selectedPlayers);

	//Get scores for each player
	var scoresForPlayers = getScoresForPlayersOverGames(selectedPlayers, games);

	//highlight wins
	var highlightedWinPointBackgroundColors = [];
	for (var m = 0; m < selectedPlayers.length; m++) {
		highlightedWinPointBackgroundColors[m] = [];
	}

	//Create a dataset for each player
	var datasets = [];
	for (var i = 0; i < selectedPlayers.length; i++) {
		datasets[i] = {
			label: selectedPlayers[i],
			fill: false,
			pointBackgroundColor: highlightedWinPointBackgroundColors[i],
			backgroundColor: graphColors[i],
			borderColor: graphColors[i],
			data: scoresForPlayers[selectedPlayers[i]]
		};
	}

	//Create chart
	chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: xLabels,
			datasets: datasets
		},
		options: {
			scales: {
				xAxes: [{
					display: false
				}]
			}
		}
	});

	//Update chart with different colors for wins
	for (var x=0; x<selectedPlayers.length; x++) {
		for (var y=0; y<playerToScoreArrayDict[selectedPlayers[x]].length; y++) {
			var currGame = playerToScoreArrayDict[selectedPlayers[x]][y].gameNumber;
			if (gameNumbers.indexOf(currGame) >= 0) {
				if (gameWinners[currGame].indexOf(selectedPlayers[x]) >= 0) {
					highlightedWinPointBackgroundColors[x].push("yellow");
				} else {
					highlightedWinPointBackgroundColors[x].push(graphColors[x]);
				}
			}
		}
	}
	chart.update();
}

function cleanUpChart(e) {
	e.stopPropagation();
	e.preventDefault();

	//Remove existing chart, if it exists
	if (chart) {
		chart.destroy();
	}
	//Remove existing legend and winpct, if it exists
	$('#visualLegend').empty();
	$('#winPct').empty();
}

function generateChartUI() {
	var chartOptionStr = 'Display <select id="chartOption" name="charts">';
	chartOptionStr += '<option value="--"--</option>';
	chartOptionStr += '<option value="Pie">Pie</option>';
	chartOptionStr += '<option value="Line">Line</option>';
	chartOptionStr += '</select> Graph';
	$('#playerSelect').append(chartOptionStr);
}

function resetChartUI() {
	$('#playerSelect').empty();
	generateChartUI();
}