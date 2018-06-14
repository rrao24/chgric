



$( document ).ready(function() {
    console.log( "ready!" );
});

$(function(){
    $( "#target" ).load("https://rrao24.github.io/chgric/gric.csv", function() {
    	Papa.parse($("#target").text(), {
			complete: function(results) {
				console.log(results);
				results = results.data;
				var currentGame = 1;
				var games = [];
				var game = {};
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
						games.push(game);
						game = {};
						i--;
					}
				}
				games.push(game);
				$('#target').append('<br><br>');
				$('#target').append(JSON.stringify(games));
				console.log(games);
			}
		});
    });
});