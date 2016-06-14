var svg = null;
var dataset = null;
var count = 0;
var color_opacity = null;
var dsv = d3.dsv(";", "text/plain");

var question_dic = {
  "Happiness index" :"Y11_Q41",
  "Satisfaction with education": "Y11_Q40a",
  "Satisfaction with present job": "Y11_Q40b",
  "Satisfaction with present standard of living": "Y11_Q40c",
  "Satisfaction with accommodation": "Y11_Q40d",
  "Satisfaction with family life": "Y11_Q40e",
  "Satisfaction with health": "Y11_Q40f",
  "Satisfaction with social life": "Y11_Q40g",
  "Satisfaction with economic situation of the country": "Y11_Q40h"
}


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

function load_data(theme) {
  var questionCode = question_dic[theme];
  $("h1").text(theme);
  // load csv
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
          return row.questionCode == questionCode;
      });

      color_opacity = d3.scale.linear()
                      .domain(d3.extent(dataset, function(row) {
                          return row.mean;
                      })).range([0.3, 1]);
      draw();
      mouse_over();

  });
}

$(document).ready(function() {

    // add svg to page
    d3.xml("svg/europe.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        $("svg").replaceWith(xml.documentElement);
        svg = d3.select("svg");

        load_data("Happiness index");
        
    });

    // dropdown 
    $(".dropdown li").click(function(e) {
      load_data(e.target.text);
    });
});