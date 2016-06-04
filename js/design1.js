var width = 600;
var height = 600;
// var dataset = [ 1,1,1,1,1];
var data = [];

var svg = d3.select("body").append("svg")
			.attr("width",width)
			.attr("height",height)

// var pie = d3.layout.pie();
var pi = Math.PI;
var outerRadius = width/2;
var outerRadiusTwo = width/4;
var innerRadius = width/4;
var innerRadiusTwo = 0;

var dsv = d3.dsv(";", "text/plain");
dsv("data/all_questions.csv")
	.row(function(d,i){
		return {
			countryCode: d.CountryCode,
			questionCode: d.question_code,
			subset: d.subset,
			answer: d.answer,
			mean: +d.Mean
		};
	})
	.get(function(error,rows){
		console.log("Loaded "+rows.length+" rows");
		if(rows.length>0){
			console.log("First row: ", rows[0]);
			console.log("Last row: ", rows[rows.length-1]);
		}
		data = d3.nest()
  			.key(function(d) { return d.countryCode; })
  			.entries(rows)[0].values;
  		console.log(data.length);
		draw();

	})

function draw(){
	var arc = d3.svg.arc()
				.innerRadius(innerRadiusTwo)
				.outerRadius(function(d,i){
					console.log("hi");
					return d.mean/10*outerRadiusTwo;
				})
				.startAngle(function(d,i){return i*2*pi/data.length})
				.endAngle(function(d,i){return (i+1)*2*pi/data.length});

	var color = d3.scale.category10();

	var arcs = svg.selectAll("g")
	        .data(data)
	        .enter()
	        .append("g")
	        .attr("transform","translate("+outerRadius+","+outerRadius+")");
	 
	arcs.append("path")
	        .attr("fill",function(d,i){
	            return color(i);
	        })
	        .attr("d",arc)
	        // .on("mouseover",function(d,i){
	        //     d3.select(this)
	        //             .transition()
	        //             .duration(2000)
	        //             .delay(100)
	        //             .ease("bounce")
	        //             .attr("transform",function(d){
	        //                 // alert(arc.centroid(d));
	        //                 return "translate(" + arc.centroid(d) + ")";
	        //             });
	        //     //document.write(this);//this指的是当前选择的对象，既是mouseover选择的rect对象
	        // })
	        // .on("mouseout",function(d,i){
	        //     d3.select(this)
	        //             .transition()
	        //             .duration(2000)
	        //             //.delay(10000)
	        //             .attr("transform",function(d){
	        //                 //alert(arc.centroid(d));
	        //                 return "translate(" + [0,0] + ")";//centroid返回的是弧形的重心与弧心的相对位置
	        //             });
	        // })
	        .transition()
	        .duration(2000)
	        .ease("linear")
	        .attr("fill",function(d,i){
	            return color(i+1);
	        });
	 
	// arcs.append("text")
	//         .attr("transform",function(d){
	//             return "translate(" + arc.centroid(d) + ")";
	//         })
	//         .attr("text-anchor","middle")
	//         .text(function(d){
	//             return d.value;
	//         });
	 
	// console.log(data);
}
