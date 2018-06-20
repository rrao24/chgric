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

	//Overlay percentages on pie chart
	var pieOptions = {
		events: false,
		animation: {
			duration: 500,
			easing: "easeOutQuart",
			onComplete: function () {
				var ctx = this.chart.ctx;
				ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';

				this.data.datasets.forEach(function (dataset) {

					for (var i = 0; i < dataset.data.length; i++) {
						var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
						  total = dataset._meta[Object.keys(dataset._meta)[0]].total,
						  mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
						  start_angle = model.startAngle,
						  end_angle = model.endAngle,
						  mid_angle = start_angle + (end_angle - start_angle)/2;

						var x = mid_radius * Math.cos(mid_angle);
						var y = mid_radius * Math.sin(mid_angle);

						ctx.fillStyle = '#fff';
						if (i == 3){ // Darker text color for lighter background
						ctx.fillStyle = '#444';
						}
						var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
						ctx.fillText(dataset.data[i], model.x + x, model.y + y);
						// Display percent in another line, line break doesn't work for fillText
						ctx.fillText(percent, model.x + x, model.y + y + 15);
					}
				});               
			}
		}
	};

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
		},
		options: pieOptions
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
    	var xLabels = getLabelsPerGame(getGamesForPlayers([selectedPlayer]));

		//Get scores for selected player
		var graphScores = getScoresForPlayer(selectedPlayer);

		//Get running average
		var runningAverage = getRunningAverage(graphScores);

		//Make wins a different color
		var highlightedWinPointBackgroundColors = [];

		//get random background color
		var rndmColor = getBackgroundColors(["", ""]);

		//Initialize chart with xLabels, graphScores
		chart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: xLabels,
		        datasets: [{
		            label: "Score",
		            fill: false,
		            pointBackgroundColor: highlightedWinPointBackgroundColors,
		            backgroundColor: rndmColor[0],
		            borderColor: rndmColor[0],
		            data: graphScores,
		        },
		        {
		        	label: "Running Average",
		        	fill: false,
		        	backgroundColor: rndmColor[1],
		            borderColor: rndmColor[1],
		            data: runningAverage
		        }]
		    },
		    options: {
		    	//Disable auto generated legend
		    	legend: {
		    		display: false
		    	},
		    	//Custom legend function
		    	legendCallback: legendCallback,
		    	scales: {
		    		xAxes: [{
		    			display: false
		    		}]
		    	}
		    }
		});

		//Used to calculate win percentage
		var wins = 0;

		//Update chart with different colors for wins
		for (var x = 0; x<playerToScoreArrayDict[selectedPlayer].length; x++) {
			var currGame = playerToScoreArrayDict[selectedPlayer][x].gameNumber;
			if (gameWinners[currGame].indexOf(selectedPlayer) >= 0) {
				highlightedWinPointBackgroundColors.push("yellow");
				wins++;
			} else {
				highlightedWinPointBackgroundColors.push(rndmColor[0]);
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
			legend: {
		    		display: false
		    	},
		    	//Custom legend function
		    	legendCallback: legendCallback,
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

	//Append custom legend
	$('#visualLegend').append(chart.generateLegend());
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