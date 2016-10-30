var id = 0;

var alchemyTable;

$.getJSON("/Core/Data/alchemy.json", function(data) {
    alchemyTable = data;
});

var myIngredients = [];
var effectList = [];

var accounts = [];

$.getJSON("/Core/Data/accounts.json", function(data) {
    acounts = data;
});

$(function() {

    id = getCookie("id");

    if (id == "") {
        document.cookie = "id=" + Math.random() + ";";
    }

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
                    updateTable += "<button type='button' class='list-group-item' onclick='addThis(this)'>" + alchemyTable[i].name + "</button>";
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

/*
    For Alchemy Page
*/

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

/*
    For Character Page
 */

function newChar(overwrite) {

    var me;

    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].id == id) {
            me = accounts[i];
        }
    }

    if (overwrite) {
        me.character = [];
    }

    var newCharacter = {};

    var race = Math.floor(Math.random() * 10);
    var faction = Math.floor(Math.random() * 10);
    var follower = Math.floor(Math.random() * 10);
    var newclass = Math.floor(Math.random() * 10);

    switch (race) {
        case 0:
            newCharacter.race = "Breton";
            break;
        case 1:
            newCharacter.race = "Bosmer";
            break;
        case 2:
            newCharacter.race = "Redguard";
            break;
        case 3:
            newCharacter.race = "Argonian";
            break;
        case 4:
            newCharacter.race = "Osimer";
            break;
        case 5:
            newCharacter.race = "Altmer";
            break;
        case 6:
            newCharacter.race = "Khajiit";
            break;
        case 7:
            newCharacter.race = "Imperial";
            break;
        case 8:
            newCharacter.race = "Nord";
            break;
        case 9:
            newCharacter.race = "Dunmer";
            break;

        default:
            break;
    }

    switch (faction) {
        case 0:
            newCharacter.faction = "The Companions";
            break;
        case 1:
            newCharacter.faction = "Mage's College";
            break;
        case 2:
            newCharacter.faction = "Dark Brotherhood";
            break;
        case 3:
            newCharacter.faction = "Thieve's Guild";
            break;
        case 4:
            newCharacter.faction = "Dawnguard";
            break;
        case 5:
            newCharacter.faction = "Vampire";
            break;
        case 6:
            newCharacter.faction = "Blade";
            break;
        case 7:
            newCharacter.faction = "Imperial Army";
            break;
        case 8:
            newCharacter.faction = "Stormcloak";
            break;
        case 9:
            newCharacter.faction = "Bard's College";
            break;

        default:
            break;
    }

    switch (follower) {
        case 0:
            newCharacter.follower = "Same class as you";
            break;
        case 1:
            newCharacter.follower = "Wizard";
            break;
        case 2:
            newCharacter.follower = "Knight";
            break;
        case 3:
            newCharacter.follower = "Ranger";
            break;
        case 4:
            newCharacter.follower = "Barbarian";
            break;
        case 5:
            newCharacter.follower = "Spellsword";
            break;
        case 6:
            newCharacter.follower = "Same race as you";
            break;
        case 7:
            newCharacter.follower = "Argonian";
            break;
        case 8:
            newCharacter.follower = "Khajiit";
            break;
        case 9:
            newCharacter.follower = "Lydia";
            break;

        default:
            break;
    }

    switch (newclass) {
        case 0:
            newCharacter.class = "Wizard";
            newCharacter.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;
        case 1:
            newCharacter.class = "Knight";
            newCharacter.details = "Heavy armor, One-Handed and Blocking or Two-Handed and Archery. Can't use magic. Smithing focus.";
            break;
        case 2:
            newCharacter.class = "Ranger";
            newCharacter.details = "Light Armor, One-Handed, and Archery. Can't use magic or heavy armor. Enchanting focus.";
            break;
        case 3:
            newCharacter.class = "Barbarian";
            newCharacter.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;
        case 4:
            newCharacter.class = "Spellsword";
            newCharacter.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;
        case 5:
            newCharacter.class = "Shaman";
            newCharacter.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;
        case 6:
            newCharacter.class = "Necromancer/Warlock";
            newCharacter.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;
        case 7:
            newCharacter.class = "Assassin";
            newCharacter.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;
        case 8:
            newCharacter.class = "Paladin";
            newCharacter.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;
        case 9:
            newCharacter.class = "Bard";
            newCharacter.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;

        default:
            break;
    }

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}