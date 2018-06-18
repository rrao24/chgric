/** Module for generating tables **/
//array which stores all created tables
var tables = [];

function generateTables() {
	for (var l = 0; l < games.length; l++) {
		var table = generateTableFromGame(games[l]);
		tables[l+1]=table;
		$("#table").append(generateEasyTableDiv(table));
	}
}

//this will just create the html for the table and not the div it would be housed in
function generateTableFromGame(game) {
	rowNames = ["Name","Fields","Pastures","Grain","Vegetables","Sheep","Wild boar","Cattle","Horses","Unused spaces","Fenced stables","Clay hut rooms","Stone hut rooms","Family members","Points for cards","Bonus points","Total"];
	rowDictKey = ["name","fields","pastures","grain","veggies","sheep","boar","cattle","horses","unused","fencedStables","clayRooms","stoneRooms","family","cards","bonus","total"];

	//checking if expansion game
	var isFOTM = false;
	for (var j = 0; j < game.numberOfPlayers; j++) {
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
	
	var table = $('<table><caption>Game '+game.gameNumber+'</cation></table>').attr('id', 'game_'+game.gameNumber+'_table').addClass("u-max-full-width");
	for (var i = 0; i < rowNames.length; i++) {
		var row = $('<tr></tr>').addClass(rowDictKey[i]).append('<td>'+rowNames[i]+'</td>');
		for (var j = 0; j < game.numberOfPlayers; j++) {
			row.append('<td>'+game.players[j][rowDictKey[i]]+'</td>');
		}
		table.append(row);
	}
	
	
	return table;
}

//use this when you just want to append the table in a new row using css grid conventions
//	once created just append to desired container div
function generateEasyTableDiv(table) {
	table_inner_div = $('<div class="twelve-columns"><div>');
	table_div = $('<div class="row"></div>');
	table_inner_div.append(table);
	table_div.append(table_inner_div);
	return table_div;
}

