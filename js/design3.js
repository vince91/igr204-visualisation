
// var padding = { top: 20, right: 20, bottom: 30, left: 40 };
var padding = { top: 40, right: 30, bottom: 30, left: 40 };
width = 400 - padding.left - padding.right,
height = 200 - padding.top - padding.bottom;
width_ = 800 - padding.left - padding.right,
height_ = 400 -padding.top - padding.bottom;
var dataset = [];
var dataset2 = [];
/*create a svg container*/
var chart = document.createElement("div");
chart.className = "Chart";
chart.id = "C1";
document.body.appendChild(chart);

var svg = d3.select("body")
            .select("div.Chart#C1")
            .append("svg")
            .attr("width", width_ + padding.left + padding.right)
            .attr("height", height_ + padding.top + padding.bottom)
            .append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

var svg2 = d3.select("body")
            .select("div.Chart#C1")
            .append("svg")
            .attr("width", width + padding.left + padding.right)
            .attr("height", height + padding.top + padding.bottom)
            .append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

// var object = chart.appendChild(svg);


var dsv = d3.dsv(",", "text/plain");
dsv("data/happiness-income,country.csv")
	.row(function(d,i){
		return {
			countryCode: d["CountryCode"],
			questionCode: d.question_code,
			subset: d.subset,
			answer: d.answer,
			mean: +d.Mean
		};
	})
  .get(function (error, rows) {
    console.log("Loaded "+ rows.length + " rows");
    if(rows.length >0){
      console.log("First row: ",rows[0])
      console.log("Last  row: ", rows[rows.length-1])
  }

  dataset = rows;
  x = d3.scale.ordinal()
                     .domain(dataset.map(function(d){return(d.subset);}))
                     .rangeRoundBands([0,width]);

  y = d3.scale.linear()
                    .domain(d3.extent(rows, function(d){ return d.mean;}))
                    .range([height,0]);

// country code as x axis
  z = d3.scale.ordinal()
                    .domain(dataset.map(function(d){return(d.countryCode);}))
                    .rangeRoundBands([0,width_]);
// income as y axis
  w = d3.scale.ordinal()
                     .domain(dataset.map(function(d){return(d.subset);}))
                     .rangeRoundBands([height_,0]);
  draw();

  });

// var dsv2 = d3.dsv(",", "text/plain");
// dsv2("data/happiness-age,country.csv")
//     .row(function(d,i){
//         return {
//         countryCode: d["CountryCode"],
//         questionCode: d.question_code,
//         subset: d.subset,
//         answer: d.answer,
//         mean: +d.Mean
//          };
//         })
//       .get(function (error, rows) {
//           console.log("Loaded "+ rows.length + " rows");
//           if(rows.length >0){
//             console.log("First row: ",rows[0])
//             console.log("Last  row: ", rows[rows.length-1])
//           }
//         dataset = rows;
//
//         x = d3.scale.ordinal()
//                          .domain(dataset.map(function(d){return(d.subset);}))
//                          .rangeRoundBands([0,width]);
//
//         y = d3.scale.linear()
//                           .domain(d3.extent(rows, function(d){ return d.mean;}))
//                          .range([height,0]);
//             // draw2();
//         });


function draw()
{

/* table1*/
var yValue = function(d){return d.mean;}
var yScale = d3.scale.linear()
                     .range([height, 0]);

var xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom');
var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient('left');

var xAxis_ = d3.svg.axis()
              .scale(z)
              .orient('bottom');
var yAxis_ = d3.svg.axis()
              .scale(w)
              .orient('left');
/* xScale.domain([d3.min(dataset, xValue), d3.max(dataset, xValue)+5]);*/

yScale.domain([d3.min(dataset, yValue)-1, d3.max(dataset, yValue)+1]);
// country-income
svg.append("g")
  .attr("class","axis")
  .attr("transform", "translate(0," + height_ + ")")
  // .attr("transform", "rotate(-65)")
  // .selectAll("text")
  //       .attr("transform", "rotate(-65)")
  .call(xAxis_)
  .append("text")
  .attr("class","label")
  .attr("x",width_)//labels
  .attr("y",-6)
  .style("text-anchor", "end")
  .text("Country")


  // svg2.append("g")
  //   .attr("class","axis")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(xAxis)
  //   .append("text")
  //   .attr("class","label")
  //   .attr("x",width)
  //   .attr("y",-6)
  //   .style("text-anchor", "end")
  //   .text("Income");
  //

svg.append("g")
     .attr("class","axis")
     .call(yAxis_)
    //  .attr("transform", "rotate(180)")
     .append("text")
     .attr("class", "label")
     .attr("x", 60)
     .attr("y", 0)
     .style("text-anchor", "end")
     .text("Income");

svg.selectAll(".point")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class","point")
    .attr("cx",function(d){
          return z(d.countryCode);
        })
        .attr('cy', function(d) {
          return w(d.subset);
       })
        .attr("r",function(d) {
          return 0.15*y(d.mean);
        })
        .attr("fill", "#2ec7c9")
        .attr("fill-opacity" ,0.5)
        .attr("transform", "translate(" + padding.left*0.25+ "," + 40+ ")");


/* add axis to svg*/
svg2.append("g")
  .attr("class","axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
  .attr("class","label")
  .attr("x",width)
  .attr("y",-6)
  .style("text-anchor", "end")
  .text("Income");

/* Add  y axis to svg */
svg2.append("g")
   .attr("class","axis")
   .call(yAxis)
   .append("text")
   .attr("class", "label")
   .attr("x", 60)
   .attr("y", 0)
   .style("text-anchor", "end")
   .text("Happiness");

/* add points */
svg2.selectAll(".point")
   .data(dataset)
   .enter()
   .append("circle")
   .attr("class","point")
   .attr("cx",function(d){

     return x(d.subset);
   })
   .attr('cy', function(d) {
     return y(d.mean);
  })
   .attr("r",5)
   .attr("fill", "#2ec7c9")
   .attr("fill-opacity" ,0.5)
   .attr("transform", "translate(" + padding.left + "," + -15+ ")");

 }

 function draw2()
 {
 /*create axis
  var xValue = function(d){  return d.subset;}
  var xScale = d3.scale.linear()
                    .range([0, width]);*/
 /* table1*/
 var yValue = function(d){return d.mean;}
 var yScale = d3.scale.linear()
                      .range([height, 0]);

 var xAxis = d3.svg.axis()
               .scale(x)
               .orient('bottom');
 var yAxis = d3.svg.axis()
               .scale(yScale)
               .orient('left');

 /* xScale.domain([d3.min(dataset, xValue), d3.max(dataset, xValue)+5]);*/

 yScale.domain([d3.min(dataset, yValue)-1, d3.max(dataset, yValue)+1]);


 /* add axis to svg*/
 svg2.append("g")
   .attr("class","axis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis)
   .append("text")
   .attr("class","label")
   .attr("x",width)
   .attr("y",-6)
   .style("text-anchor", "end")
   .text("Age");
 /* Add  y axis to svg */
 svg2.append("g")
    .attr("class","axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", 60)
    .attr("y", 0)
    .style("text-anchor", "end")
    .text("Happiness");




 // x.domain(dataset.map(function(d){ return d.subset; }));

 /* add points */
 svg2.selectAll(".point")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class","point")
    .attr("cx",function(d){

      return x(d.subset);
    })
    .attr('cy', function(d) {
      return y(d.mean);
   })
    .attr("r",5)
    .attr("fill", "#2ec7c9")
    .attr("fill-opacity" ,0.5)
    .attr("transform", "translate(" + padding.left + "," + -15+ ")");


  }
