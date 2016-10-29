$(document).ready(function() {

    $.getJSON("../Core/Data/navbar.json", function(data) {
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