var svg = null;
var dataset = null;
var count = 0;
function draw() {
	console.log("draw");
	console.log(svg);
	svg.selectAll(".europe")
	   .datum(function(d) { return { countryCode: d3.select(this).attr("id") }})
	   .data(dataset, function(d) { return d.countryCode })
	   .style("fill", "red");
	   //.each(function(d) { console.log(this.id, d, ++count)});
}

$(document).ready(function() {

	// add svg to page
    d3.xml("svg/europe.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        $("body").append(xml.documentElement);
        svg = d3.select("svg");

        // load csv
        var dsv = d3.dsv(";", "text/plain")
        dsv("data/all_questions.csv", function(d) {
        	return {
        		countryCode: d.CountryCode.toLowerCase(),
        		questionCode: d.question_code,
        		subset: d.subset,
        		answer: d.answer,
        		mean: +d.Mean
        	}
        }, function(error, rows) {
        	console.log(rows[0]);
        	dataset = rows.filter(function(row) {
        		return row.questionCode == "Y11_Q41"
        	})
        	console.log(dataset)
        	draw();

        });
    });




});