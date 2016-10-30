//Disable all console commands
(function() {
    try {
        var $_console$$ = console;
        Object.defineProperty(window, "console", {
            get: function() {
                if ($_console$$._commandLineAPI)
                    throw "Sorry, for security reasons, the script console is deactivated on maoxiantime.com";
                return $_console$$
            },
            set: function($val$$) {
                $_console$$ = $val$$
            }
        })
    } catch ($ignore$$) {}
})();

var characters = getCharacters();

//retrieve all the alchemy shtuff
var alchemyTable = [];

//set variables for current ingredients and effects list
var myIngredients = [];
var effectList = [];

//initialize new character
var newChar = {};

$(function() {

    loadNav(function() {
        $.getJSON("/Core/Data/alchemy.json", function(data) {
            alchemyTable = data;
            loadAlchemyTable();

            loadChars();
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

    $("#effectSelect").change(function() {
        switch ($(this).val()) {
            case 'Standalone Potions':

                var list = "<option disabled selected>Potion</option>" +
                    "<option value='Cure Disease'>Cure Disease</option>" +
                    "<option value='Fear'>Fear</option>" +
                    "<option value='Frenzy'>Frenzy</option>" +
                    "<option value='Invisibility'>Invisibility</option>" +
                    "<option value='Palarysis'>Palarysis</option>" +
                    "<option value='Slow'>Slow</option>" +
                    "<option value='Waterbreathing'>Waterbreathing</option>";

                $("#targetSelect").html(list);
                $("#thirdSelect").fadeOut();

                break;
            case 'Damage':

                var list = "<option disabled selected>Target</option>" +
                    "<option value='Health'>Health</option>" +
                    "<option value='Magicka'>Magicka</option>" +
                    "<option value='Magicka Regen'>Magicka Regen</option>" +
                    "<option value='Stamina'>Stamina</option>" +
                    "<option value='Stamina Regen'>Stamina Regen</option>" +
                    "<option value='Lingering Health'>Lingering Health</option>" +
                    "<option value='Lingering Magicka'>Lingering Magicka</option>" +
                    "<option value='Lingering Stamina'>Lingering Stamina</option>";

                $("#targetSelect").html(list);
                $("#thirdSelect").fadeOut();

                break;
            case 'Ravage':

                var list = "<option disabled selected>Target</option>" +
                    "<option value='Health'>Health</option>" +
                    "<option value='Magicka'>Magicka</option>" +
                    "<option value='Stamina'>Stamina</option>";

                $("#targetSelect").html(list);
                $("#thirdSelect").fadeOut();

                break;
            case 'Fortify':

                var list = "<option disabled selected>Type</option>" +
                    "<option value='Stats'>Stats</option>" +
                    "<option value='Skills'>Skills</option>";

                $("#targetSelect").html(list);
                $("#thirdSelect").fadeIn();

                var newList = "<option disabled selected>Target</option>" +
                    "<option value='Fire'>Fire</option>" +
                    "<option value='Frost'>Frost</option>" +
                    "<option value='Magic'>Magic</option>" +
                    "<option value='Poison'>Poison</option>" +
                    "<option value='Shock'>Shock</option>";

                $("#thirdSelect").html(newList);

                break;
            case 'Regenerate':

                var list = "<option disabled selected>Target</option>" +
                    "<option value='Health'>Health</option>" +
                    "<option value='Magicka'>Magicka</option>" +
                    "<option value='Stamina'>Stamina</option>";

                $("#targetSelect").html(list);
                $("#thirdSelect").fadeOut();

                break;
            case 'Restore':

                var list = "<option disabled selected>Target</option>" +
                    "<option value='Health'>Health</option>" +
                    "<option value='Magicka'>Magicka</option>" +
                    "<option value='Stamina'>Stamina</option>";

                $("#targetSelect").html(list);
                $("#thirdSelect").fadeOut();

                break;
            case 'Magic Potions':

                var list = "<option disabled selected>Effect</option>" +
                    "<option value='Resist'>Resist</option>" +
                    "<option value='Weakness'>Weakness</option>";

                $("#targetSelect").html(list);
                $("#thirdSelect").fadeIn();

                var newList = "<option disabled selected>Target</option>" +
                    "<option value='Fire'>Fire</option>" +
                    "<option value='Frost'>Frost</option>" +
                    "<option value='Magic'>Magic</option>" +
                    "<option value='Poison'>Poison</option>" +
                    "<option value='Shock'>Shock</option>";

                $("#thirdSelect").html(newList);

                break;

            default:
                break;
        }
    });

    $("#targetSelect").change(function() {
        switch ($(this).val()) {
            case 'Skills':

                var list = "<option disabled selected>Target</option>" +
                    "<option value='Alteration'>Alteration</option>" +
                    "<option value='Barter'>Barter</option>" +
                    "<option value='Block'>Block</option>" +
                    "<option value='Carry Weight'>Carry Weight</option>" +
                    "<option value='Conjuration'>Conjuration</option>" +
                    "<option value='Destruction'>Destruction</option>" +
                    "<option value='Enchanting'>Enchanting</option>" +
                    "<option value='Heavy Armor'>Heavy Armor</option>" +
                    "<option value='Illusion'>Illusion</option>" +
                    "<option value='Light Armor'>Light Armor</option>" +
                    "<option value='Lockpicking'>Lockpicking</option>" +
                    "<option value='Marksman'>Marksman</option>" +
                    "<option value='One-Handed'>One-Handed</option>" +
                    "<option value='Pickpocket'>Pickpocket</option>" +
                    "<option value='Restoration'>Restoration</option>" +
                    "<option value='Smithing'>Smithing</option>" +
                    "<option value='Sneak'>Sneak</option>" +
                    "<option value='Two-Handed'>Two-Handed</option>";

                $("#thirdSelect").html(list);

                break;
            case 'Stats':

                var list = "<option disabled selected>Target</option>" +
                    "<option value='Health'>Health</option>" +
                    "<option value='Magicka'>Magicka</option>" +
                    "<option value='Stamina'>Stamina</option>";

                $("#thirdSelect").html(list);

                break;
            default:
                break;
        }
    });

    $("#potionsDropdowns").submit(function(e) {
        e.preventDefault();

        var one = (e.target.secondSel.value.split(' ')[0] == "Lingering") ? "Lingering Damage" : e.target.firstSel.value;

        var two = (e.target.secondSel.value.split(' ')[0] == "Lingering") ? e.target.secondSel.value.split(' ')[1] : e.target.secondSel.value;

        var thr = e.target.thirdSel.value;

        if (one == 'Standalone Potions' || one == 'Effect' || one == 'Magic Potions') one = '';
        if (two == 'Stats' || two == 'Skills' || two == 'Target' || two == 'Potion' || two == 'Type' || two == 'Effect') two = '';
        if (thr == 'Target') thr = '';

        //loadIngTable();
        console.log('Queries:');
        console.log('');

        console.log(one);
        console.log(two);
        console.log(thr);

        console.log('');
        console.log('Results:');
        console.log('');

        console.log('');
        console.log(alchemyTable[0].effect[0]);
        console.log('');

        console.log(alchemyTable[0].effect[0].includes(one));
        console.log(alchemyTable[0].effect[0].includes(two));
        console.log(alchemyTable[0].effect[0].includes(thr));

        var tables = "<center><h3 class='cinzel'>Ingredients</h3></center>" +
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
            for (var j = 0; j < 4; j++) {
                if (alchemyTable[i].effect[j].includes(one) && alchemyTable[i].effect[j].includes(two) && alchemyTable[i].effect[j].includes(thr)) {
                    tables += "<tr><td>" + alchemyTable[i].id + "</td>" +
                        "<td>" + alchemyTable[i].name + "</td>" +
                        "<td>" + alchemyTable[i].effect[0] + "</td>" +
                        "<td>" + alchemyTable[i].effect[1] + "</td>" +
                        "<td>" + alchemyTable[i].effect[2] + "</td>" +
                        "<td>" + alchemyTable[i].effect[3] + "</td></tr>";
                }
            }
        }


        tables += "</tr></table></div>";

        $("#customIngredients").html(tables);

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

function getCharacters() {

    var chars = (document.cookie == '') ? '' : document.cookie.split('; ');
    var aChars = [];

    for (var i = 0; i < chars.length; i++) {

        var thisChar = chars[i].split('=');
        var traits = chars[i].split('=')[1].split(',');

        var oChar = {
            name: thisChar[0]
        };

        switch (parseInt(traits[0])) {
            case 0:
                oChar.race = "Breton";
                oChar.img = "/Core/Images/Races/Breton.png";
                break;
            case 1:
                oChar.race = "Bosmer";
                oChar.img = "/Core/Images/Races/Bosmer.png";
                break;
            case 2:
                oChar.race = "Redguard";
                oChar.img = "/Core/Images/Races/Redguard.png";
                break;
            case 3:
                oChar.race = "Argonian";
                oChar.img = "/Core/Images/Races/Argonian.png";
                break;
            case 4:
                oChar.race = "Orsimer";
                oChar.img = "/Core/Images/Races/Orsimer.png";
                break;
            case 5:
                oChar.race = "Altmer";
                oChar.img = "/Core/Images/Races/Altmer.png";
                break;
            case 6:
                oChar.race = "Khajiit";
                oChar.img = "/Core/Images/Races/Khajiit.png";
                break;
            case 7:
                oChar.race = "Imperial";
                oChar.img = "/Core/Images/Races/Imperial.png";
                break;
            case 8:
                oChar.race = "Nord";
                oChar.img = "/Core/Images/Races/Nord.png";
                break;
            case 9:
                oChar.race = "Dunmer";
                oChar.img = "/Core/Images/Races/Dunmer.png";
                break;

            default:
                break;
        }

        switch (parseInt(traits[1])) {
            case 0:
                oChar.faction = "The Companions";
                break;
            case 1:
                oChar.faction = "Mage's College";
                break;
            case 2:
                oChar.faction = "Dark Brotherhood";
                break;
            case 3:
                oChar.faction = "Thieve's Guild";
                break;
            case 4:
                oChar.faction = "Dawnguard";
                break;
            case 5:
                oChar.faction = "Vampire";
                break;
            case 6:
                oChar.faction = "Blade";
                break;
            case 7:
                oChar.faction = "Imperial Army";
                break;
            case 8:
                oChar.faction = "Stormcloak";
                break;
            case 9:
                oChar.faction = "Bard's College";
                break;

            default:
                break;
        }

        switch (parseInt(traits[2])) {
            case 0:
                oChar.follower = "Same class as you";
                break;
            case 1:
                oChar.follower = "Wizard";
                break;
            case 2:
                oChar.follower = "Knight";
                break;
            case 3:
                oChar.follower = "Ranger";
                break;
            case 4:
                oChar.follower = "Barbarian";
                break;
            case 5:
                oChar.follower = "Spellsword";
                break;
            case 6:
                oChar.follower = "Same race as you";
                break;
            case 7:
                oChar.follower = "Argonian";
                break;
            case 8:
                oChar.follower = "Khajiit";
                break;
            case 9:
                oChar.follower = "Lydia";
                break;

            default:
                break;
        }

        switch (parseInt(traits[3])) {
            case 0:
                oChar.class = "Wizard";
                oChar.details = "Destruction, Restoration, and Alteration. Can't use armor. Enchanting focus.";
                break;
            case 1:
                oChar.class = "Knight";
                oChar.details = "Heavy armor, One-Handed and Blocking or Two-Handed and Archery. Can't use magic. Smithing focus.";
                break;
            case 2:
                oChar.class = "Ranger";
                oChar.details = "Light Armor, One-Handed, and Archery. Can't use heavy armor. Enchanting focus.";
                break;
            case 3:
                oChar.class = "Barbarian";
                oChar.details = "Two-Handed or Dual Wielding, Light Armor, and Archery. Can't use magic or heavy armor. Alchemy focus.";
                break;
            case 4:
                oChar.class = "Spellsword";
                oChar.details = "Conjuration, One-Handed or Two-Handed, and Destruction. Can't use non-conjured weapons. Enchanting focus.";
                break;
            case 5:
                oChar.class = "Shaman";
                oChar.details = "Restoration, One-Handed, and Destruction. Can't use heavy armor. Alchemy focus.";
                break;
            case 6:
                oChar.class = "Necromancer/Warlock";
                oChar.details = "Conjuration, Destruction, and Alteration. Can't use restoration. Alchemy focus.";
                break;
            case 7:
                oChar.class = "Assassin";
                oChar.details = "Sneak, Illusion, and One-Handed or Archery. Can't use heavy armor. Enchanting focus.";
                break;
            case 8:
                oChar.class = "Paladin";
                oChar.details = "Heavy Armor, Restoration, and One-Handed or Two-Handed. Can't use magic other than restoration. Smithing focus.";
                break;
            case 9:
                oChar.class = "Bard";
                oChar.details = "Illusion, Restoration, and One-Handed. Can't use destruction. Enchanting focus.";
                break;

            default:
                break;
        }

        aChars.push(oChar);
    }

    return aChars;
}

function loadChars() {

    for (var i = 0; i < characters.length; i++) {

        var newCharPanel = "<div class='panel panel-default' id='charPanel'>" +
            "<div class='panel-body'>" +
            "<div class='row'>" +
            "<div class='col-sm-4'>" +
            "<img src='" + characters[i].img + "' alt='" + characters[i].race + "' class='img-thumbnail img-responsive center-block'>" +
            "</div>" +
            "<div class='col-sm-8'>" +
            "<form class='form-horizontal'>" +
            "<div class='form-group'>" +
            "<label class='col-sm-2 control-label'>Name</label>" +
            "<div class='col-sm-10'>" +
            "<p class='form-control-static'>" + characters[i].name + "</p>" +
            "</div>" +
            "<label class='col-sm-2 control-label'>Race</label>" +
            "<div class='col-sm-10'>" +
            "<p class='form-control-static'>" + characters[i].race + "</p>" +
            "</div>" +
            "<label class='col-sm-2 control-label'>Faction</label>" +
            "<div class='col-sm-10'>" +
            "<p class='form-control-static'>" + characters[i].faction + "</p>" +
            "</div>" +
            "<label class='col-sm-2 control-label'>Follower</label>" +
            "<div class='col-sm-10'>" +
            "<p class='form-control-static'>" + characters[i].follower + "</p>" +
            "</div>" +
            "<label class='col-sm-2 control-label'>Class</label>" +
            "<div class='col-sm-10'>" +
            "<p class='form-control-static'>" + characters[i].class + "</p>" +
            "</div>" +
            "<label class='col-sm-2 control-label'>Details</label>" +
            "<div class='col-sm-10'>" +
            "<p class='form-control-static'>" + characters[i].details + "</p>" +
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

function randomize() {

    var race = Math.floor(Math.random() * 10);
    var faction = Math.floor(Math.random() * 10);
    var follower = Math.floor(Math.random() * 10);
    var newclass = Math.floor(Math.random() * 10);

    newChar.traits = race + "," + faction + "," + follower + "," + newclass;

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

    // COOKIES SET TO EXPIRE: expires=Thu, 1 Jan 2026 12:00:00 UTC;
    // DELETE COOKIES LIKE THIS: expires=Sat, 29 Oct 2016 12:00:00 UTC;

    if (overwrite) {

        for (var i = 0; i < characters.length; i++) {
            delCookie(characters[i].name);
        }

        characters = [];

        $("#characterPanels").html("");
    }

    if ($("#newcharname").val() == "") {
        newChar.name = "Hadvar";
    } else {
        newChar.name = $("#newcharname").val();
    }

    characters.push(newChar);

    addCookie(newChar.name, newChar.traits);

    var newCharPanel = "<div class='panel panel-default' id='charPanel'>" +
        "<div class='panel-body'>" +
        "<div class='row'>" +
        "<div class='col-sm-4'>" +
        "<img src='" + newChar.img + "' alt='" + newChar.race + "' class='img-thumbnail img-responsive center-block'>" +
        "</div>" +
        "<div class='col-sm-8'>" +
        "<form class='form-horizontal'>" +
        "<div class='form-group'>" +
        "<label class='col-sm-2 control-label'>Name</label>" +
        "<div class='col-sm-10'>" +
        "<p class='form-control-static'>" + newChar.name + "</p>" +
        "</div>" +
        "<label class='col-sm-2 control-label'>Race</label>" +
        "<div class='col-sm-10'>" +
        "<p class='form-control-static'>" + newChar.race + "</p>" +
        "</div>" +
        "<label class='col-sm-2 control-label'>Faction</label>" +
        "<div class='col-sm-10'>" +
        "<p class='form-control-static'>" + newChar.faction + "</p>" +
        "</div>" +
        "<label class='col-sm-2 control-label'>Follower</label>" +
        "<div class='col-sm-10'>" +
        "<p class='form-control-static'>" + newChar.follower + "</p>" +
        "</div>" +
        "<label class='col-sm-2 control-label'>Class</label>" +
        "<div class='col-sm-10'>" +
        "<p class='form-control-static'>" + newChar.class + "</p>" +
        "</div>" +
        "<label class='col-sm-2 control-label'>Details</label>" +
        "<div class='col-sm-10'>" +
        "<p class='form-control-static'>" + newChar.details + "</p>" +
        "</div>" +
        "</div>" +
        "</form>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

    $("#characterPanels").append(newCharPanel);
}

/*
    Misc. Functions
*/

function addCookie(cname, ctraits) {
    document.cookie = cname + "=" + ctraits + ";expires=Thu, 1 Jan 2026 12:00:00 UTC;";
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

function delCookie(cname) {
    if (getCookie(cname)) {
        document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}