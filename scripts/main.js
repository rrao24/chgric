	//Holds names of all pages on site
	var pages = ["home","table","graph","search"];


$( document ).ready(function() {
	changePage("home");
	/** Global Variables **/

	//Hold all game objects to be used by any and all functions
	var games = [];

	//Hold mapping of player name to associated array of scores
	//used by graphing function
	var playerToScoreArrayDict = {};

	//Dictionary of game number to winner of game
	var gameWinners = [""];

	//Hold current chart
	var chart;

	//Get data from csv
    $( "#target" ).load("https://rrao24.github.io/chgric/gric.csv", function() {
    	//Parse csv
    	Papa.parse($("#target").text(), {
			complete: function(results) {
				//console.log(results);
				
				results = results.data;
				var currentGame = 1;
				var game = {};

				//Iterate through all lines in excel sheet
				for (var i = 1; i < results.length; i++) {
					var gameNo = parseInt(results[i][0]);
					if (currentGame == gameNo) {
						game.numberOfPlayers = parseInt(results[i][1]);
						game.gameNumber = gameNo;
						var playerStats = {};
						playerStats.name = results[i][2];
						playerStats.fields = parseInt(results[i][3]);
						playerStats.pastures = parseInt(results[i][4]);
						playerStats.grain = parseInt(results[i][5]);
						playerStats.veggies = parseInt(results[i][6]);
						playerStats.sheep = parseInt(results[i][7]);
						playerStats.boar = parseInt(results[i][8]);
						playerStats.cattle = parseInt(results[i][9]);
						playerStats.horses = parseInt(results[i][10]);
						playerStats.unused = parseInt(results[i][11]);
						playerStats.fencedStables = parseInt(results[i][12]);
						playerStats.clayRooms = parseInt(results[i][13]);
						playerStats.stoneRooms = parseInt(results[i][14]);
						playerStats.family = parseInt(results[i][15]);
						playerStats.cards = parseInt(results[i][16]);
						playerStats.bonus = parseInt(results[i][17]);
						playerStats.total = parseInt(results[i][18]);
						if (!game.players) {
							game.players = [];
						}
						game.players.push(playerStats);
					} else {
						currentGame++;
						game = deriveStats(game, gameWinners);
						games.push(game);
						game = {};
						i--;
					}
				}

				game = deriveStats(game, gameWinners);
				games.push(game);

				$('#target').append('<br><br>');
				$('#target').append(JSON.stringify(games));
				console.log(games);

				//Populate player to score dictionary
				for (var l = 0; l < games.length; l++) {
					var tempStats = games[l].players;
					var tempGameNo = games[l].gameNumber;
					for (var m = 0; m < tempStats.length; m++) {
						var currName = tempStats[m].name;
						var currScore = tempStats[m].total;
						if (!playerToScoreArrayDict[currName]) {
							playerToScoreArrayDict[currName] = [];
						}
						playerToScoreArrayDict[currName].push({score: currScore, gameNumber: tempGameNo});
					}
				}

				//Create interactive HTML option for user
				var chartOptionStr = 'Display <select id="chartOption" name="charts">';
				chartOptionStr += '<option value="--"--</option>';
				chartOptionStr += '<option value="Pie">Pie</option>';
				chartOptionStr += '<option value="Line">Line</option>';
				chartOptionStr += '</select> Graph';
				$('#playerSelect').append(chartOptionStr);
			}
		});
    });

    //Generate pie chart
    $(document).on('change', '#chartOption', function(e) {
    	e.stopPropagation();
    	e.preventDefault();

    	//Remove existing chart, if it exists
    	if (chart) {
    		chart.destroy();
    	}
    	//Remove existing legend and winpct, if it exists
    	$('#visualLegend').empty();
    	$('#winPct').empty();

    	var selectedChartType = $('#chartOption').val();
    	var ctx = document.getElementById('gricVisual').getContext('2d');

    	if (selectedChartType == 'Pie') {
    		//Rebuild graph options UI
    		$('#playerSelect').empty();
    		var chartOptionStr = 'Display <select id="chartOption" name="charts">';
    		chartOptionStr += '<option value="--"--</option>';
			chartOptionStr += '<option value="Pie" selected="selected">Pie</option>';
			chartOptionStr += '<option value="Line">Line</option>';
			chartOptionStr += '</select> Graph';
			$('#playerSelect').append(chartOptionStr);

			//Store all player names who have won a game
    		var xLabels = [];
    		var names = Object.keys(playerToScoreArrayDict);
    		for (var q = 0; q<names.length; q++) {
    			if (gameWinners.indexOf(names[q]) > 0) {
    				xLabels.push(names[q]);
    			}
    		}

    		//Get wins by each player, in order of xLabels
    		var graphWins = [];
    		var winsByPlayer = {};
    		for (var k = 0; k < gameWinners.length; k++) {
    			if (!winsByPlayer[gameWinners[k]]) {
    				winsByPlayer[gameWinners[k]] = 1;
    			} else {
    				winsByPlayer[gameWinners[k]]++;
    			}
    		}
    		for (var y = 0; y<xLabels.length; y++) {
    			graphWins.push(winsByPlayer[xLabels[y]]);
    		}

    		//Get as many background colors as players
    		var graphColors = [];
    		for (var x = 0; x<xLabels.length; x++) {
    			graphColors.push(backgroundColors[x]);
    		}

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
    	} else if (selectedChartType == "Line") {
    		
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
    });

    //Generate associated line graph for scores upon user clicking a player's name
    $(document).on('change', '#playerOption', function(e) {
    	e.stopPropagation();
    	e.preventDefault();

    	//Remove existing chart, if it exists
    	if (chart) {
    		chart.destroy();
    	}
    	//Remove existing legend and winpct, if it exists
    	$('#visualLegend').empty();
    	$('#winPct').empty();

    	var selectedPlayer = $('#playerOption').val();
    	var ctx = document.getElementById('gricVisual').getContext('2d');

    	//execute if change is legitimate
    	if (selectedPlayer !== "default") {

	    	//Create labels for each data point
			var xLabels = [];
			for (var q = 0; q<playerToScoreArrayDict[selectedPlayer].length; q++) {
				var v = q+1;
				xLabels.push("Game #" + v);
			}

			//Get scores for selected player
			var graphScores = [];
			for (var y = 0; y<playerToScoreArrayDict[selectedPlayer].length; y++) {
				graphScores.push(playerToScoreArrayDict[selectedPlayer][y].score);
			}

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
    });
});

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

//Switches between pages on site
function changePage(name) {
	for (var j = 0; j < pages.length; j++) {
		$("#"+pages[j]).hide();
	}
	$("#"+name).show();
}