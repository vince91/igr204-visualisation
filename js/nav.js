$(document).ready(function() {
	$("nav a").click(function(event) {
		var text = event.target.text;
		console.log(text);

		$("nav li").removeClass("active");
		$(event.target).parent().addClass("active");

		switch(text) {
			case "Design #1":
				$("#main").load("design1.html");
				break;
			case "Design #2":
				$("#main").load("design2.html");
				break;
			case "Design #3":
				break;
			default:
		}
	})
})