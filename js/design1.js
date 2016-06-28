var width = 400;
var height = 300;
// var dataset = [ 1,1,1,1,1];
var data = [];
var allData = [];
var countries = [];
var pi = Math.PI;
var outerRadius = height/2;
var outerRadiusTwo = height/2;
var innerRadius = height/4;
var innerRadiusTwo = height/16;
var selectedCountry = "UK";
var selectedCountries = ["UK"];
var svg;
var countryId=0;

var currentMousePos = {top:0, left:0}

var country_dic = {};
var question_dic = {
  "Y11_Q41":"Happiness index",
  "Y11_Q40a":"Satisfaction with education",
  "Y11_Q40b":"Satisfaction with present job",
  "Y11_Q40c":"Satisfaction with present standard of living",
  "Y11_Q40d":"Satisfaction with accommodation",
  "Y11_Q40e":"Satisfaction with family life",
  "Y11_Q40f":"Satisfaction with health",
  "Y11_Q40g":"Satisfaction with social life",
  "Y11_Q40h":"Satisfaction with economic situation of the country"
};

$('#btn').on('click', function (e) {
	addCountry(false);

})
addCountry(true);
$(document).mousemove(function(event) {
    currentMousePos.left = event.pageX - 70;
    currentMousePos.top = event.pageY + 20;
});
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
	  		$(allData).each(function(i,e){
	  			country_dic[e.key]=i;
	  			// console.log(e.key+" "+i);
	  		})
	  		loadCountry(0);
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
		var id=countryId.toString();
		newDiv.className = "col-md-6";
		newDiv.id = countryId.toString();
		// newDiv.className = "country";
		// newDiv.id = "c"+countryId.toString();
		newDiv.innerHTML = '<div class="country" id=c'+countryId.toString()+'><div class="container">\
							<div class="dropdown" id="dropdown'+countryId.toString()+'">\
							  <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Country Code\
							  <span class="caret"></span></button>\
							  <ul class="dropdown-menu" id="countrylist">\
							   \
							  </ul>\
							</div>\
						</div><a id="delete'+countryId.toString()+'">Delete</a></div>';
		$("#out").append(newDiv);
	  	loadCountry(countryId);
		$('a#delete'+id.toString()).on('click',function(){
			$('.col-md-6#'+id.toString()).remove();
			selectedCountries.splice(id,1);
		});
		svg = d3.select("body").select("div.country#c"+countryId.toString()).append("svg")
			.attr("width",width)
			.attr("height",height);
		countryId++;
		selectedCountries.push(selectedCountry);
		draw(id);
	}

}

function loadCountry(id){
	var idStr=id.toString();
	countryList = $('#dropdown'+idStr+' .dropdown-menu');
	countryList.html('');
	$(allData).each(function(index, element){
    	var item = ('<li><a href="#">'+element.key+'</a></li>');
    	countryList.append(item);
	});
	$('#dropdown'+idStr).on('click', 'a', function(e){
	    var setText = $(e.currentTarget).text(),
	        newHtml = setText + '&nbsp;<span class="caret"></span>';
	    $('#dropdown'+idStr+' > button').html(newHtml);
	});
	// countryList.$('li a').on('click', function(){
	$('#dropdown'+idStr+' .dropdown-menu li a').on('click', function(){
	    selectedCountry = $(this).text();
	    selectedCountries[id] = selectedCountry;
	    draw(id);
	});
}

function updateCountry(){

}
function draw(id){
	var idStr = "0";
	if(id){
		idStr=id.toString();
	}
	svg = d3.select("body").select("div.country#c"+idStr).select("svg");
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
	        .attr("transform","translate("+(outerRadius+100)+","+outerRadius+")");
	// to display the name of the country in the center
	svg.append("text").attr('x', width/2+40).attr('y', height/2+10)
		.attr("font-family","sans-serif")
		.attr('font-size', '20px')
		.attr('fill', 'blue')
		.text(selectedCountry);
	arcs.append("path")
	        .attr("fill",function(d,i){
	            return color(i);
	        })
	        .attr("d",arc)
	        .on("mouseover",function(d,i){
	        	var qc = d.questionCode;
	        	$("#question").text(question_dic[qc]);
	        	var ans=d.countryCode+" "+d.mean.toString();
	        	$(selectedCountries).each(function(i,e){
	        		if(e==d.countryCode) return;
	        		$(allData[country_dic[e]].values).each(function(ii,ee){
	        			if(ee.questionCode==qc){
	        				ans+=","+e+" "+ee.mean;
	        				return;
	        			}
	        		});
	        	});
	        	$("#answer").text(ans);
	            $('#info-container').offset(currentMousePos).show();

	            if(!d.mean)
	              $("#info-container").hide();

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
