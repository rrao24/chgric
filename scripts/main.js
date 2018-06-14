
$( document ).ready(function() {
    // Parse local CSV file
	Papa.parse("https://github.com/rrao24/chgric/blob/master/gric.csv", {
		download: true,
		complete: function(results) {
			console.log("Finished:", results.data);
		}
	});
});