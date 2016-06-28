$(document).ready(function() {
	$("nav a").click(function(event) {
		var text = event.target.text;
		console.log(text);

		$("nav li").removeClass("active");
		$(event.target).parent().addClass("active");

		switch(text) {
			case "Design #1":
				break;
			case "Design #2":
				console.log("ok");
				break;
			case "Design #3":
				break;
			default:
		}
	})
})