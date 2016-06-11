var padding = { top: 20, right: 20, bottom: 30, left: 40 };
width = 400 - padding.left - padding.right,
height = 200 - padding.top - padding.bottom;
var dataset = [];
//create a svg container
var svg = d3.select("body")
            .append("svg")
            .attr("width", width + padding.left + padding.right)
            .attr("height", height + padding.top + padding.bottom)
            .append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

var svg2 = d3.select("body")
            .append("svg")
            .attr("width", width + padding.left + padding.right)
            .attr("height", height + padding.top + padding.bottom)
            .append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top+width + ")");

//Lload data
var dsv = d3.dsv(",", "text/plain");
dsv("data/happiness-age,country.csv")
	.row(function(d,i){
		return {
			countryCode: d["CountryCode"],
			questionCode: d.question_code,
			subset: +d.subset,
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
  x = d3.scale.linear()
                      .domain(d3.extent(rows, function(row){
                          return row.subset;}))
                        .range([0,width]);
  y = d3.scale.linear()
                      .domain(d3.extent(rows, function(row){
                         return row.mean;}))
                         .range([height,0]);
  dataset = rows;
  draw();
  });


function draw(){
//create axis
var xValue = function(d){  return d.subset+1;}
var xScale = d3.scale.linear()
                    .range([0, width]);

var yValue = function(d){return d.mean;}
var yScale = d3.scale.linear()
                     .range([height, 0]);

var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient('bottom');
              // .ticks(20)
              // .tickFormat(function(d){return d;}
            // );
var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient('left');

xScale.domain([d3.min(dataset, xValue), d3.max(dataset, xValue)+5]);
yScale.domain([d3.min(dataset, yValue)-1, d3.max(dataset, yValue)+1]);



// Add  x axis to svg
svg.append("g")
  .attr("class","axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
  .attr("class","label")
  .attr("x",width)
  .attr("y",-6)
  .style("text-anchor", "end")
  .text("Age");
// Add  y axis to svg
svg.append("g")
   .attr("class","axis")
   .call(yAxis)
   .append("text")
   .attr("class", "label")
   .attr("x", 60)
   .attr("y", 0)
   .style("text-anchor", "end")
   .text("Happiness");

// add points
svg.selectAll(".point")
   .data(dataset)
   .enter()
   .append("circle")
   .attr("class","point")
   .attr("cx",function(d){
     return x(d.subset)+10;
   })
   .attr('cy', function(d) {
     return y(d.mean);
  })
   .attr("r",5)
   .attr("fill", "#2ec7c9")
   .attr("fill-opacity" ,0.5);


 }
