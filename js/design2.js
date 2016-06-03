var svg = null;


$(document).ready(function() {

    d3.xml("svg/europe.svg", "image/svg+xml", function(error, xml) {
        if (error) throw error;
        $("body").append(xml.documentElement);
    });


});