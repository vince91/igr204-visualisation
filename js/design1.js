var width = 300;
var height = 300;
// var dataset = [ 1,1,1,1,1];
var data = [];
var allData = [];
var countries = [];
var pi = Math.PI;
var outerRadius = width/2;
var outerRadiusTwo = width/2;
var innerRadius = width/4;
var innerRadiusTwo = width/16;
var selectedCountry = "UK";
var svg;
var countryId=0;
$('#btn').on('click', function (e) {
	addCountry(false);

})
addCountry(true);
function loadData(){
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
			allData = d3.nest()
	  			.key(function(d) { return d.countryCode; })
	  			.entries(rows);
	  		var id = "dropdown";
	  		loadCountry(id);
			countryId++;
			draw();
		})
}

function addCountry(init){
	if(init){
		svg = d3.select("body").select("div.country#c"+countryId.toString()).append("svg")
			.attr("width",width)
			.attr("height",height);
		loadData();
	}
	else{
		var newDiv =  document.createElement("div");
		newDiv.className = "country";
		newDiv.id = "c"+countryId.toString();
		newDiv.innerHTML = '				<div class="row",id="in">\
					<div class="col-md-2">\
					    <div class="container">\
							<div class="dropdown" id="dropdown'+countryId.toString()+'">\
							  <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Country Code\
							  <span class="caret"></span></button>\
							  <ul class="dropdown-menu" id="countrylist">\
							   \
							  </ul>\
							</div>\
						</div>\
					</div>\
					<div class="col-md-2">\
						<div id="question">Question</div>\
						<div id="answer">Answer</div>\
					</div>\
				</div>';
		document.body.appendChild(newDiv);
		var id = "dropdown"+countryId.toString();
	  	loadCountry(id);
		
		svg = d3.select("body").select("div.country#c"+countryId.toString()).append("svg")
			.attr("width",width)
			.attr("height",height);
		console.log(svg);
		countryId++;
		draw();
	}

}

function loadCountry(id){
	countryList = $('#'+id+' .dropdown-menu');
	console.log(allData);
	countryList.html('');
	$(allData).each(function(index, element){
    	var item = ('<li><a href="#">'+element.key+'</a></li>');
    	countryList.append(item);
	});
	$('#'+id).on('click', 'a', function(e){
	    var setText = $(e.currentTarget).text(),
	        newHtml = setText + '&nbsp;<span class="caret"></span>';
	    $('#'+id+' > button').html(newHtml);
	    console.log("!!!");
	});
	// countryList.$('li a').on('click', function(){
	$('#'+id+' .dropdown-menu li a').on('click', function(){
	    selectedCountry = $(this).text();
	    draw();
	    console.log("T_T");
	});
}

function updateCountry(){

}
function draw(){
	svg.html('');
	for (var i = allData.length - 1; i >= 0; i--) {
		if(allData[i].key == selectedCountry){
			data = allData[i].values;
		}
	};
	var arc = d3.svg.arc()
				.innerRadius(innerRadiusTwo)
				.outerRadius(function(d,i){
					return d.mean/10*outerRadiusTwo;
					// return d.mean/10*(outerRadiusTwo-innerRadiusTwo)+innerRadiusTwo;
				})
				.startAngle(function(d,i){return i*2*pi/data.length})
				.endAngle(function(d,i){return (i+1)*2*pi/data.length});

	var color = d3.scale.category10();

	var arcs = svg.selectAll("g")
	        .data(data)
	        .enter()
	        .append("g")
	        .attr("transform","translate("+outerRadius+","+outerRadius+")");
	// to display the name of the country in the center
	svg.append("text").attr('x', width/2).attr('y', height/2)
		.attr("font-family","sans-serif")
		.attr('font-size', '20px')
		.attr('fill', 'red')
		.text(selectedCountry);
	console.log("??");
	arcs.append("path")
	        .attr("fill",function(d,i){
	            return color(i);
	        })
	        .attr("d",arc)
	        .on("mouseover",function(d,i){
	        	$("#question").text(d.questionCode);
	        	$("#answer").text(d.mean);
	        	console.log(d.questionCode);
	            // d3.select(this)
	            //         .transition()
	            //         .duration(2000)
	            //         .delay(100)
	            //         .ease("bounce")
	            //         .attr("transform",function(d){
	            //             // alert(arc.centroid(d));
	            //             return "translate(" + arc.centroid(d) + ")";
	            //         });
	            //document.write(this);//this指的是当前选择的对象，既是mouseover选择的rect对象
	        });
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
	        // .transition()
	        // .duration(2000)
	        // .ease("linear")
	        // .attr("fill",function(d,i){
	        //     return color(i+1);
	        // });
	 
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
