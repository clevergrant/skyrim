$(document).ready(function() {

    $.ajax({
        url: "Pages/Components/nav.html",
        dataType: "html",
        success: function(data) {
            $("nav").html(data);
        }
    });


});