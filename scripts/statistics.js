function generateStatsUI() {
	var playerNames = Object.keys(playerToScoreArrayDict);
	var statsOptionStr = 'Display stats for: <select id="statsOption" name="stats">';
	statsOptionStr += '<option value="default">--</option>'
	for (var i = 0; i < playerNames.length; i++) {
		statsOptionStr += '<option value="' + playerNames[i] + '">' + playerNames[i] + '</option>';
	}
	$('#statsSelect').append(statsOptionStr);
}

function generateStatistics(playerName) {
	if (playerName !== "default") {
		var games = getGamesForPlayers([playerName]);
		//Initialize stats
		var statsObj = {};
		statsObj.gamesPlayed = 0;
		statsObj.fields = {avg: 0, stdev: 0};
		statsObj.pastures = {avg: 0, stdev: 0};
		statsObj.grain = {avg: 0, stdev: 0};
		statsObj.veggies = {avg: 0, stdev: 0};
		statsObj.sheep = {avg: 0, stdev: 0};
		statsObj.boar = {avg: 0, stdev: 0};
		statsObj.cattle = {avg: 0, stdev: 0};
		statsObj.unused = {avg: 0, stdev: 0};
		statsObj.fencedStables = {avg: 0, stdev: 0};
		statsObj.rooms = {avg: 0, stdev: 0};
		statsObj.family = {avg: 0, stdev: 0};
		statsObj.cards = {avg: 0, stdev: 0};
		statsObj.bonus = {avg: 0, stdev: 0};
		statsObj.total = {avg: 0, stdev: 0};

		//Compute averages
		for (var i = 0; i < games.length; i++) {
			for (var j = 0; j < games[i].players.length; j++) {
				if (games[i].players[j].name == playerName) {
					var stats = games[i].players[j];
					statsObj.gamesPlayed++;
					statsObj.fields.avg += stats.fields;
					statsObj.pastures.avg += stats.pastures;
					statsObj.grain.avg += stats.grain;
					statsObj.veggies.avg += stats.veggies;
					statsObj.sheep.avg += stats.sheep;
					statsObj.boar.avg += stats.boar;
					statsObj.cattle.avg += stats.cattle;
					statsObj.unused.avg += stats.unused;
					statsObj.fencedStables.avg += stats.fencedStables;
					statsObj.rooms.avg += stats.clayRooms;
					statsObj.rooms.avg += stats.stoneRooms;
					statsObj.family.avg += stats.family;
					statsObj.cards.avg += stats.cards;
					statsObj.bonus.avg += stats.bonus;
					statsObj.total.avg += stats.total;
				}
			}
		}

		for (var z in statsObj) {
			if (z !== "gamesPlayed") {
				statsObj[z].avg = (statsObj[z].avg / statsObj.gamesPlayed).toFixed(2);
			}
		}

		//Compute standard deviations
		for (var m = 0; m < games.length; m++) {
			for (var n = 0; n < games[m].players.length; n++) {
				if (games[m].players[n].name == playerName) {
					var stats = games[m].players[n];
					statsObj.fields.stdev += Math.pow((stats.fields - statsObj.fields.avg), 2);
					statsObj.pastures.stdev += Math.pow((stats.pastures - statsObj.pastures.avg), 2);
					statsObj.grain.stdev += Math.pow((stats.grain - statsObj.grain.avg), 2);
					statsObj.veggies.stdev += Math.pow((stats.veggies - statsObj.veggies.avg), 2);
					statsObj.sheep.stdev += Math.pow((stats.sheep - statsObj.sheep.avg), 2);
					statsObj.boar.stdev += Math.pow((stats.boar - statsObj.boar.avg), 2);
					statsObj.cattle.stdev += Math.pow((stats.cattle - statsObj.cattle.avg), 2);
					statsObj.unused.stdev += Math.pow((stats.unused - statsObj.unused.avg), 2);
					statsObj.fencedStables.stdev += Math.pow((stats.fencedStables - statsObj.fencedStables.avg), 2);
					statsObj.rooms.stdev += Math.pow((stats.clayRooms + stats.stoneRooms - statsObj.rooms.avg), 2);
					statsObj.family.stdev += Math.pow((stats.family - statsObj.family.avg), 2);
					statsObj.cards.stdev += Math.pow((stats.cards - statsObj.cards.avg), 2);
					statsObj.bonus.stdev += Math.pow((stats.bonus - statsObj.bonus.avg), 2);
					statsObj.total.stdev += Math.pow((stats.total - statsObj.total.avg), 2);
				}
			}
		}

		//Create table display
		$('#averages_container').empty();
		var averagesTable = $('<table id="currentAvgsTable"></table>').addClass("u-max-full-width").addClass("gameTable");
		averagesTable.append($('<tr><td>Category</td><td>Average</td><td>Standard Deviation</td></tr>'))

		for (var k in statsObj) {
			if (k !== "gamesPlayed") {
				statsObj[k].stdev = Math.pow((statsObj[k].stdev / statsObj.gamesPlayed), 0.5).toFixed(2);
				var row = $('<tr><td>' + k.replace("avg", "") + '</td><td>' + statsObj[k].avg + '</td><td>' + statsObj[k].stdev + '</td></tr>');
				averagesTable.append(row);
			}
		}

		$('#averages_container').append(averagesTable);
	}
}