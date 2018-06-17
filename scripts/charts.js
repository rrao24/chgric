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

		//Append custom legend
		$('#visualLegend').append(chart.generateLegend());

		//Used to calculate win percentage
		var wins = 0;

		//Update chart with different colors for wins
		for (var x = 0; x<playerToScoreArrayDict[selectedPlayer].length; x++) {
			var currGame = playerToScoreArrayDict[selectedPlayer][x].gameNumber;
			if (gameWinners[currGame] == selectedPlayer) {
				highlightedWinPointBackgroundColors.push("yellow");
				wins++;
			} else {
				highlightedWinPointBackgroundColors.push("rgb(255, 99, 132)");
			}
		}
		chart.update();

		//Display win percentage
		var winPct = (wins/(playerToScoreArrayDict[selectedPlayer].length)).toFixed(2);
		$('#winPct').append('Win Percentage: ' + winPct);
	}
}

function buildMultiLineGraph(ctx, initialPlayer, selectedPlayers) {
	//Get games
	selectedPlayers.push(initialPlayer);
	var games = getGamesForPlayers(selectedPlayers);

	//Create labels for each data point
	var xLabels = getLabelsPerGame(games);

	//Different color for each player
	var graphColors = getBackgroundColors(selectedPlayers);

	//Get scores for each player
	var scoresForPlayers = getScoresForPlayersOverGames(selectedPlayers, games);

	//Create a dataset for each player
	var datasets = [];
	for (var i = 0; i < selectedPlayers.length; i++) {
		datasets[i] = {
			label: selectedPlayers[i],
			fill: false,
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