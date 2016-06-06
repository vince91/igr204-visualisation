var svg = null;
var dataset = null;
var count = 0;
var color_opacity = null;

function draw() {
    svg.selectAll(".europe")
       .datum(function(d) { return { countryCode: d3.select(this).attr("id") }})
       .data(dataset, function(d) { return d.countryCode })
       .style("fill", "red")
       .style("fill-opacity", function(d) {
            return color_opacity(d.mean);
       });
};

function mouse_over() {
    svg.selectAll(".europe")
       .on("mouseover", function(d) {
            $("#country").text(d.countryCode);
            $("#mean").text(d.mean);
       })
       .on("mouseout", function() {
            $("#country").text('');
            $("#mean").text('');
       })
};

$(document).ready(function() {

    // add svg to page
    d3.xml("svg/europe.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        $("svg").replaceWith(xml.documentElement);
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
            });

            color_opacity = d3.scale.linear()
                            .domain(d3.extent(dataset, function(row) {
                                return row.mean;
                            })).range([0.3, 1]);
            draw();
            mouse_over();

        });
    });
});