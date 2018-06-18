/** Global Variables **/

//Holds names of all pages on site
var pages = ["home","table","graph","stats"];

//Hold all game objects to be used by any and all functions
var games = [];

//Hold mapping of player name to associated array of scores
//used by graphing function
var playerToScoreArrayDict = {};

//Dictionary of game number to winner of game
var gameWinners = [""];

//Hold current chart
var chart;

$( document ).ready(function() {
	changePage("home");

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
						//catch cases of 1 off excel sheet
						if (game.players) {
							game = deriveStats(game, gameWinners);
							games.push(game);
							game = {};
							i--;
						}
					}
				}

				//catch cases of 1 off excel sheet
				if (game.players) {
					game = deriveStats(game, gameWinners);
					games.push(game);
				}

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
				generateChartUI();
				
				//Create tables of all games
				generateTables();
			}
		});
    });

    //Generate chart
    $(document).on('change', '#chartOption', function(e) {
    	cleanUpChart(e);

    	var selectedChartType = $('#chartOption').val();
    	var ctx = document.getElementById('gricVisual').getContext('2d');

    	if (selectedChartType == 'Pie') {

    		buildPieChart(ctx);

    	} else if (selectedChartType == "Line") {

    		generateLineChartOptions();

    	} else {

    		resetChartUI();
    	}
    });

    //Generate associated line graph for scores upon user clicking a player's name
    $(document).on('change', '#playerOption', function(e) {
    	cleanUpChart(e);

    	var selectedPlayer = $('#playerOption').val();
    	var ctx = document.getElementById('gricVisual').getContext('2d');

    	buildLineGraph(ctx, selectedPlayer);

    	generateMoreLineChartOptions();
    });

    //Generate associated line graph for scores upon clicking multiple players
    $(document).on('change', '#againstOption', function(e) {
    	cleanUpChart(e);

    	var initialPlayer = $('#playerOption').val();
    	var selectedPlayers = $('#againstOption').val();
    	var ctx = document.getElementById('gricVisual').getContext('2d');

    	if (selectedPlayers.length > 0) {
    		buildMultiLineGraph(ctx, initialPlayer, selectedPlayers);
    	} else {
    		buildLineGraph(ctx, initialPlayer);
    	}
    });
});

//Switches between pages on site
function changePage(name) {
	for (var j = 0; j < pages.length; j++) {
		$("#"+pages[j]).hide();
	}
	$("#"+name).show();
}