$(document).ready(function() {

    $.get("/Pages/Components/nav.html", function(data) {
        $("nav").html(data);

        $.getJSON("/Core/Data/navbar.json", function(data) {
            $.each(data, function() {

                var newNav = "<li>" +
                    "<a href='" + this.url + "'>" +
                    this.text +
                    "</a>" +
                    "</li>";

                $("#navLinks").append(newNav);
            });
        });

    });

});