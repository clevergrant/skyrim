var alchemyTable;

$.getJSON("/Core/Data/alchemy.json", function(data) {
    alchemyTable = data;
});

var myIngredients = [];
var effectList = [];

$(function() {

    loadNav(function() {
        loadAlchemyTable(function() {});
    });

    $("#ingSearch").keyup(function() {

        var updateTable = "";

        if ($(this).val() == "") {
            $("#currIngTable").html("<li class='list-group-item' style='color: #ccc;'>Results</li>");
        } else {
            for (var i = 0; i < alchemyTable.length; i++) {

                if (alchemyTable[i].name.toLowerCase().includes($(this).val().toLowerCase())) {

                    updateTable += "<button type='button' class='list-group-item' onclick='addThis(this)'>" +
                        alchemyTable[i].name +
                        "</button>";
                }
            }

            $("#currIngTable").html(updateTable);
        }

    });

});

function loadNav(callback) {
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

            callback();

        }); //$.getJSON

    }); //$.get
}

function loadAlchemyTable(callback) {

    var tables = "<center><h3 class='cinzel'>SKYRIM</h3></center>" +
        "<div class='table-responsive'>" +
        "<table class='table table-hover'>" +
        "<tr style='background: #eee;'>" +
        "<th>No.</th>" +
        "<th>Ingredient</th>" +
        "<th>Effect 1</th>" +
        "<th>Effect 2</th>" +
        "<th>Effect 3</th>" +
        "<th>Effect 4</th>" +
        "</tr>";

    for (var i = 0; i < alchemyTable.length; i++) {
        if (alchemyTable[i].expansion == "Vanilla") {
            tables += "<tr><td>" + alchemyTable[i].id + "</td>" +
                "<td>" + alchemyTable[i].name + "</td>" +
                "<td>" + alchemyTable[i].effect[0] + "</td>" +
                "<td>" + alchemyTable[i].effect[1] + "</td>" +
                "<td>" + alchemyTable[i].effect[2] + "</td>" +
                "<td>" + alchemyTable[i].effect[3] + "</td></tr>";
        }
    }

    tables += "</table></div>" +
        "<center><h3 class='cinzel'>DAWNGUARD</h3></center>" +
        "<div class='table-responsive'>" +
        "<table class='table table-hover'>" +
        "<tr style='background: #eee;'>" +
        "<th>No.</th>" +
        "<th>Ingredient</th>" +
        "<th>Effect 1</th>" +
        "<th>Effect 2</th>" +
        "<th>Effect 3</th>" +
        "<th>Effect 4</th>" +
        "</tr>";

    for (var i = 0; i < alchemyTable.length; i++) {
        if (alchemyTable[i].expansion == "Dawnguard") {
            tables += "<tr><td>" + alchemyTable[i].id + "</td>" +
                "<td>" + alchemyTable[i].name + "</td>" +
                "<td>" + alchemyTable[i].effect[0] + "</td>" +
                "<td>" + alchemyTable[i].effect[1] + "</td>" +
                "<td>" + alchemyTable[i].effect[2] + "</td>" +
                "<td>" + alchemyTable[i].effect[3] + "</td></tr>";
        }
    }

    tables += "</table></div>" +
        "<center><h3 class='cinzel'>HEARTHFIRE</h3></center>" +
        "<div class='table-responsive'>" +
        "<table class='table table-hover'>" +
        "<tr style='background: #eee;'>" +
        "<th>No.</th>" +
        "<th>Ingredient</th>" +
        "<th>Effect 1</th>" +
        "<th>Effect 2</th>" +
        "<th>Effect 3</th>" +
        "<th>Effect 4</th>" +
        "</tr>";

    for (var i = 0; i < alchemyTable.length; i++) {
        if (alchemyTable[i].expansion == "Hearthfire") {
            tables += "<tr><td>" + alchemyTable[i].id + "</td>" +
                "<td>" + alchemyTable[i].name + "</td>" +
                "<td>" + alchemyTable[i].effect[0] + "</td>" +
                "<td>" + alchemyTable[i].effect[1] + "</td>" +
                "<td>" + alchemyTable[i].effect[2] + "</td>" +
                "<td>" + alchemyTable[i].effect[3] + "</td></tr>";
        }
    }

    tables += "</tr></table></div>";

    $("#ingredients").html(tables);

    callback();

}

function addThis(item) {

    $("#clearbtn").show();

    var exists = false;

    for (var i = 0; i < myIngredients.length; i++) {
        if (myIngredients[i].name == item.innerHTML) exists = true;
    }

    if (!exists) {
        for (var i = 0; i < alchemyTable.length; i++) {
            if (alchemyTable[i].name == item.innerHTML) {
                myIngredients.push(alchemyTable[i]);
            }
        }
    }

    $("#currIngList").html("");

    for (var i = 0; i < myIngredients.length; i++) {
        var newIng = "<li class='list-group-item'>" + myIngredients[i].name + "</li>";
        $("#currIngList").append(newIng);
    }

    for (var i = 0; i < myIngredients.length; i++) {

        if (myIngredients[i].name == item.innerHTML) {

            for (var j = 0; j < 4; j++) {

                var found = false;

                for (var k = 0; k < effectList.length; k++) {

                    if (myIngredients[i].effect[j] == effectList[k].name) {
                        found = true;
                        effectList[k].freq++;
                    }
                }

                if (!found) {

                    effectList.push({
                        name: myIngredients[i].effect[j],
                        freq: 1
                    });
                }
            }

        }

    }

    var newPotion = "";

    for (var i = 0; i < effectList.length; i++) {
        if (effectList[i].freq > 1) {
            newPotion += "<li class='list-group-item'>";

            if (effectList[i].freq % 2 == 0) {
                newPotion += "<span class='badge'>" + (effectList[i].freq / 2) + "</span>";
            } else {
                newPotion += "<span class='badge'>" + ((effectList[i].freq - 1) / 2) + "</span>";
            }

            newPotion += effectList[i].name + "</li>";
        }
    }

    $("#currPotList").html(newPotion);
}

function clearIng() {
    $("#clearbtn").hide();
    myIngredients = [];
    effectList = [];
    $("#currPotList").html("");
    $("#currIngList").html("");
    $("#ingSearch").val("");
    $("#currIngTable").html("<li class='list-group-item' style='color: #ccc;'>Results</li>");
}