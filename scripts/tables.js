/** Module for generating tables **/
var tables = [];

function generateTables() {
	for (var l = 0; l < games.length; l++) {
		var table_html = generateTableFromGame(games[l]);
		tables[l+1]=table_html;
		table_div = $('<div class="row"></div>');
		table_div.append(table_html);
		$("#table").append(table_div);
	}
}

function generateTableFromGame(game) {
	rowNames = ["Name","Fields","Pastures","Grain","Vegetables","Sheep","Wild boar","Cattle","Horses","Unused spaces","Fenced stables","Clay hut rooms","Stone hut rooms","Family members","Points for cards","Bonus points","Total"];
	rowDictKey = ["name","fields","pastures","grain","veggies","sheep","boar","cattle","horses","unused","fencedStables","clayRooms","stoneRooms","family","cards","bonus","total"];

	//checking if expansion game
	var isFOTM = false;
	for (var j = 0; j < game.numberOfPlayers; j++) {
		if(game.gameNumber==134){
			console.log(game);
			debugger;
		}
		if (game.players[j].horses != 0) {
			isFOTM = true;
			break;
		}
	}
	
	//if it is not expansion, then remove the horses column
	if (!isFOTM) {
		rowNames.splice(8, 1);
		rowDictKey.splice(8, 1);
	}
	
	var table = $('<table><caption>Game '+game.gameNumber+'</cation></table>').attr('id', 'game_'+game.gameNumber+'_table');
	for (var i = 0; i < rowNames.length; i++) {
		var row = $('<tr></tr>').addClass(rowDictKey[i]).append('<td>'+rowNames[i]+'</td>');
		for (var j = 0; j < game.numberOfPlayers; j++) {
			row.append('<td>'+game.players[j][rowDictKey[i]]+'</td>');
		}
		table.append(row);
	}
	
	
	return table;
}

