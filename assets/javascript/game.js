// Global variables
var baseAttack = 0;
var player;
var defender;
var charArray = [];
var playerChosen = false;
var defenderChosen = false;

//Constructor - builds character
function Character(name, hp, ap, cp, pic) {
    this.name = name;
    this.healthPoints = hp;
    this.attackPower = ap;
    this.counterPower = cp;
    this.pic = pic;
}



// Increase the attack strength (this attack strength + original attack strength)
Character.prototype.increaseAttack = function () {
    this.attackPower += baseAttack;
};


// Performs an attack
Character.prototype.attack = function (Obj) {
    Obj.healthPoints -= this.attackPower;
    $("#msg").html("You attacked " +
        Obj.name + " for " + this.attackPower + " damage");
    this.increaseAttack();
};


// Performs a counter attack
Character.prototype.counterAttack = function (Obj) {
    Obj.healthPoints -= this.counterPower;
    $("#msg").append("<br>" + this.name + " countered " + this.counterPower + " damage");
};


// Initialize all the characters
function initCharacters() {
    var han = new Character("Han Solo", 120, 10, 5, "./assets/images/han.jpg");
    var yoda = new Character("Yoda", 200, 50, 30, "./assets/images/yoda.jpg");
    var jango = new Character("Jango Fett", 150, 15, 2, "./assets/images/jango.jpg");
    var vader = new Character("Darth Vader", 180, 30, 12, "./assets/images/vader.jpg");
    charArray.push(han, yoda, jango, vader);
}


// "Save" the original attack value
function setBaseAttack(Obj) {
    baseAttack = Obj.attackPower;
}



// Checks if character is alive
function isAlive(Obj) {
    if (Obj.healthPoints > 0) {
        return true;
    }
    return false;
}


// Checks if the player has won
function isWinner() {
    if (charArray.length == 0 && player.healthPoints > 0)
        return true;
    else return false;
}


// Create the character cards onscreen
function characterCards(divID) {
    $(divID).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(divID).append("<div />");
        $(divID + " div:last-child").addClass("card");
        $(divID + " div:last-child").append("<img />");
        $(divID + " img:last-child").attr("id", charArray[i].name);
        $(divID + " img:last-child").attr("class", "card-img-top");
        $(divID + " img:last-child").attr("src", charArray[i].pic);
        $(divID + " img:last-child").attr("width", 150);
        $(divID + " img:last-child").attr("height", 200);
        $(divID + " img:last-child").addClass("img-thumbnail");
        $(divID + " div:last-child").append(charArray[i].name + "<br>");
        $(divID + " div:last-child").append("HP: " + charArray[i].healthPoints);
        $(divID + " idv:last-child").append();

    }
}


// Update the characters pictures location on the screen (move them between divs)
function updatePics(fromDivID, toDivID) {
    $(fromDivID).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(toDivID).append("<img />");
        $(toDivID + " img:last-child").attr("id", charArray[i].name);
        $(toDivID + " img:last-child").attr("src", charArray[i].pic);
        $(toDivID + " img:last-child").attr("width", 150);
        $(divID + " img:last-child").attr("height", 200);
        $(toDivID + " img:last-child").addClass("img-thumbnail");
    }
}


// plays audio file (.mp3)
function playAudio() {
    var audio = new Audio(".assets/media/cantina-song.mp3");
    audio.play();
}


// Change the view from the first screen to the second screen
function changeView() {
    $("#startScreen").empty();
    $("#fightScreen").show();
}


// Stores the defender the user has clicked on in the defender variable and removes it from the charArray
$(document).on("click", "img", function () {
    if (playerSelected && !defenderSelected && (this.id != player.name)) {
        for (var j = 0; j < charArray.length; j++) {
            if (charArray[j].name == (this).id) {
                defender = charArray[j]; // sets defender
                charArray.splice(j, 1);
                defenderSelected = true;
                $("#msg").html("Click to attack!");
            }
        }
        $("#defender").append(this); // appends the selected defender to the div 
        $("#defender").append("<br>" + defender.name);
        $("#defenderHealth").append("HP: " + defender.healthPoints);
        
    }

// Stores the character the user has clicked on in the player variable and removes it from charArray
if (!playerSelected) {
    for (var i = 0; i < charArray.length; i++) {
        if (charArray[i].name == (this).id) {
            player = charArray[i]; // sets current player
            playAudio(); // starts theme song
            $("body").css({
                "background-image": "url('./assets/images/" + this.id[0] + ".jpg')"
            }); // changes the background picture according to the user selection
            setBaseAttack(player);
            charArray.splice(i, 1);
            playerSelected = true;
            changeView();
            $("#msg").html("Choose your opponent!");
        }
    }
    updatePics("#game", "#defendersLeft");
    $("#player").append(this); // appends the selected player to the div
    $("#player").append(player.name);
    $("#playerHealth").append("HP: " + player.healthPoints);
    
}

});


// The attack button functionality
$(document).on("click", "#attackBtn", function () {
    if (playerSelected && defenderSelected) {
        if (isAlive(player) && isAlive(defender)) {
            player.attack(defender);
            defender.counterAttack(player);
            $("#playerHealth").html("HP: " + player.healthPoints);
            $("#defenderHealth").html("HP: " + defender.healthPoints);
            if (!isAlive(defender)) {
                $("#defenderHealth").html("DEFETED!");
                $("#playerHealth").html("Enemy defeated!");
                $("#msg").html("Pick another enemy to battle...");
            }
            if (!isAlive(player)) {
                $("#playerHealth").html("YOU LOSE!");
                $("#msg").html("Try again?");
                $("#attackBtn").html("Restart Game");
                $(document).on("click", "#attackBtn", function () { // restarts game
                    location.reload();
                });
            }
        }
        if (!isAlive(defender)) {
            $("#defender").removeClass("animated zoomInRight");
            $("#defenderHealth").removeClass("animated zoomInRight");
            $("#defender").children().remove();
            $("#defender").html("");
            $("#defenderHealth").html("");
            defenderSelected = false;
            if (isWinner()) {
                $("#fightScreen").hide();
                $("#winnerMsg").show();
            }
        }
    }
});



// EXECUTE
$(document).ready(function () {
    $("#fightScreen").hide();
    $("#winnerMsg").hide();
    initCharacters();
    characterCards("#game");
});