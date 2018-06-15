$( document ).ready(function() {
	//Get data from csv
    $( "#target" ).load("https://rrao24.github.io/chgric/gric.csv", function() {
    	//Parse csv
    	Papa.parse($("#target").text(), {
			complete: function(results) {
				//console.log(results);
				
				results = results.data;
				var currentGame = 1;
				var games = [];
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
						game = deriveStats(game);
						games.push(game);
						game = {};
						i--;
					}
				}

				game = deriveStats(game);
				games.push(game);

				$('#target').append('<br><br>');
				$('#target').append(JSON.stringify(games));
				console.log(games);
			}
		});
    });
});

//Get winner, max score, average score of game object
function deriveStats(game) {
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
	return game;
}