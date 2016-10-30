//set gloabal id
var id = 0;

//retrieve all the alchemy shtuff
var alchemyTable = [];

//set variables for current ingredients and effects list
var myIngredients = [];
var effectList = [];

//retrieve the accounts
var accounts = [];
var me = { id: -1 };

//initialize new character
var newChar = {};

$(function() {

    loadNav(function() {

        loadAlchemyTable();
        loadAccounts(function() {
            loadChars();
        });

        $.getJSON("/Core/Data/alchemy.json", function(data) {
            alchemyTable = data;
        });

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

function loadAccounts(callback) {
    id = getCookie("id");

    if (id == "") {
        document.cookie = "id=" + Math.random() + ";";
        me.id = parseFloat(id);
    } else {

        $.getJSON("/Core/Data/accounts.json", function(data) {
            accounts = data;
            for (var i = 0; i < accounts.length; i++) {

                if (accounts[i].id == parseFloat(id)) {
                    me = accounts[i];
                }
            }
            callback();
        }).fail(function(err) {
            console.log(err);
        });

    }
}

/*
    For Alchemy Page
*/

function loadAlchemyTable() {

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

function loadChars() {

    if (me.id != -1) {

        for (var i = 0; i < me.character.length; i++) {

            var newCharPanel = "<div class='panel panel-default' id='charPanel'>" +
                "<div class='panel-body'>" +
                "<div class='row'>" +
                "<div class='col-sm-4'>" +
                "<img src='" + me.character[i].img + "' alt='" + me.character[i].race + "' class='img-thumbnail img-responsive center-block'>" +
                "</div>" +
                "<div class='col-sm-8'>" +
                "<form class='form-horizontal'>" +
                "<div class='form-group'>" +
                "<label class='col-sm-2 control-label'>Name</label>" +
                "<div class='col-sm-10'>" +
                "<p class='form-control-static'>" + me.character[i].name + "</p>" +
                "</div>" +
                "<label class='col-sm-2 control-label'>Race</label>" +
                "<div class='col-sm-10'>" +
                "<p class='form-control-static'>" + me.character[i].race + "</p>" +
                "</div>" +
                "<label class='col-sm-2 control-label'>Faction</label>" +
                "<div class='col-sm-10'>" +
                "<p class='form-control-static'>" + me.character[i].faction + "</p>" +
                "</div>" +
                "<label class='col-sm-2 control-label'>Follower</label>" +
                "<div class='col-sm-10'>" +
                "<p class='form-control-static'>" + me.character[i].follower + "</p>" +
                "</div>" +
                "<label class='col-sm-2 control-label'>Class</label>" +
                "<div class='col-sm-10'>" +
                "<p class='form-control-static'>" + me.character[i].class + "</p>" +
                "</div>" +
                "<label class='col-sm-2 control-label'>Details</label>" +
                "<div class='col-sm-10'>" +
                "<p class='form-control-static'>" + me.character[i].details + "</p>" +
                "</div>" +
                "</div>" +
                "</form>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

            $("#characterPanels").append(newCharPanel);

        }
    }
}

function randomize() {

    var race = Math.floor(Math.random() * 10);
    var faction = Math.floor(Math.random() * 10);
    var follower = Math.floor(Math.random() * 10);
    var newclass = Math.floor(Math.random() * 10);

    switch (race) {
        case 0:
            newChar.race = "Breton";
            newChar.img = "/Core/Images/Races/Breton.png";
            break;
        case 1:
            newChar.race = "Bosmer";
            newChar.img = "/Core/Images/Races/Bosmer.png";
            break;
        case 2:
            newChar.race = "Redguard";
            newChar.img = "/Core/Images/Races/Redguard.png";
            break;
        case 3:
            newChar.race = "Argonian";
            newChar.img = "/Core/Images/Races/Argonian.png";
            break;
        case 4:
            newChar.race = "Orsimer";
            newChar.img = "/Core/Images/Races/Orsimer.png";
            break;
        case 5:
            newChar.race = "Altmer";
            newChar.img = "/Core/Images/Races/Altmer.png";
            break;
        case 6:
            newChar.race = "Khajiit";
            newChar.img = "/Core/Images/Races/Khajiit.png";
            break;
        case 7:
            newChar.race = "Imperial";
            newChar.img = "/Core/Images/Races/Imperial.png";
            break;
        case 8:
            newChar.race = "Nord";
            newChar.img = "/Core/Images/Races/Nord.png";
            break;
        case 9:
            newChar.race = "Dunmer";
            newChar.img = "/Core/Images/Races/Dunmer.png";
            break;

        default:
            break;
    }

    switch (faction) {
        case 0:
            newChar.faction = "The Companions";
            break;
        case 1:
            newChar.faction = "Mage's College";
            break;
        case 2:
            newChar.faction = "Dark Brotherhood";
            break;
        case 3:
            newChar.faction = "Thieve's Guild";
            break;
        case 4:
            newChar.faction = "Dawnguard";
            break;
        case 5:
            newChar.faction = "Vampire";
            break;
        case 6:
            newChar.faction = "Blade";
            break;
        case 7:
            newChar.faction = "Imperial Army";
            break;
        case 8:
            newChar.faction = "Stormcloak";
            break;
        case 9:
            newChar.faction = "Bard's College";
            break;

        default:
            break;
    }

    switch (follower) {
        case 0:
            newChar.follower = "Same class as you";
            break;
        case 1:
            newChar.follower = "Wizard";
            break;
        case 2:
            newChar.follower = "Knight";
            break;
        case 3:
            newChar.follower = "Ranger";
            break;
        case 4:
            newChar.follower = "Barbarian";
            break;
        case 5:
            newChar.follower = "Spellsword";
            break;
        case 6:
            newChar.follower = "Same race as you";
            break;
        case 7:
            newChar.follower = "Argonian";
            break;
        case 8:
            newChar.follower = "Khajiit";
            break;
        case 9:
            newChar.follower = "Lydia";
            break;

        default:
            break;
    }

    switch (newclass) {
        case 0:
            newChar.class = "Wizard";
            newChar.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
            break;
        case 1:
            newChar.class = "Knight";
            newChar.details = "Heavy armor, One-Handed and Blocking or Two-Handed and Archery. Can't use magic. Smithing focus.";
            break;
        case 2:
            newChar.class = "Ranger";
            newChar.details = "Light Armor, One-Handed, and Archery. Can't use heavy armor. Enchanting focus.";
            break;
        case 3:
            newChar.class = "Barbarian";
            newChar.details = "Two-Handed or Dual Wielding, Light Armor, and Archery. Can't use magic or heavy armor. Alchemy focus.";
            break;
        case 4:
            newChar.class = "Spellsword";
            newChar.details = "Conjuration, One-Handed or Two-Handed, and Destruction. Can't use non-conjured weapons. Enchanting focus.";
            break;
        case 5:
            newChar.class = "Shaman";
            newChar.details = "Restoration, One-Handed, and Destruction. Can't use heavy armor. Alchemy focus.";
            break;
        case 6:
            newChar.class = "Necromancer/Warlock";
            newChar.details = "Conjuration, Destruction, and Alteration. Can't use restoration. Alchemy focus.";
            break;
        case 7:
            newChar.class = "Assassin";
            newChar.details = "Sneak, Illusion, and One-Handed or Archery. Can't use heavy armor. Enchanting focus.";
            break;
        case 8:
            newChar.class = "Paladin";
            newChar.details = "Heavy Armor, Restoration, and One-Handed or Two-Handed. Can't use magic other than restoration. Smithing focus.";
            break;
        case 9:
            newChar.class = "Bard";
            newChar.details = "Illusion, Restoration, and One-Handed. Can't use destruction. Enchanting focus.";
            break;

        default:
            break;
    }

    $("#newcharrace").html(newChar.race);
    $("#newcharpic").html("<img src='" + newChar.img + "' alt='" + newChar.race + "' class='img-thumbnail img-responsive center-block'>");
    $("#newcharfaction").html(newChar.faction);
    $("#newcharfollower").html(newChar.follower);
    $("#newcharclass").html(newChar.class);
    $("#newchardetails").html(newChar.details);
}

function saveChar(overwrite) {

    if (overwrite) {
        me.character = [];
    }

    newChar.name = $("#newcharname").val();

    me.character.push(newChar);

    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].id == me.id) {
            accounts[i] = me;
            console.log("After setting accounts[] array");
        }
    }

    console.log("data sent:")
    console.log(accounts);

    $.post("../Core/Data/accounts.json", JSON.stringify(accounts), function(data, status) {
        console.log("POST");
        console.log(data);
        $(".modal-body").append("<div class='alert alert-success'><b>Saved: </b>" + status + "</div>");
        //location.reload()
    }, 'json').fail(function(err) {
        $(".modal-body").append("<div class='alert alert-danger'><b>ERROR: </b>" + err + "</div>");
    });
}

/*
    Misc. Functions
*/

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

function postJSON(url, data, successFunc, failFunc) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        success: function(data, status) {
            successFunc(data, status);
        },
        error: function(err) {
            failFunc(err);
        }
    });
}