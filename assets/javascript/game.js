
var baseAttack = 0;
var player;
var defender;
var charArray = [];
var playerSelected = false;
var defenderSelected = false;


$(window).on("load", function() {
    document.getElementById("my_audio");
});

function Character(name, hp, ap, cp, pic) {
    this.name = name;
    this.healthPoints = hp;
    this.attackPower = ap;
    this.counterPower = cp;
    this.pic = pic;
}


Character.prototype.increaseAttack = function () {
    this.attackPower += baseAttack;
};


Character.prototype.attack = function (Obj) {
    Obj.healthPoints -= this.attackPower;
    $("#msg").html("You attacked " +
        Obj.name + " for " + this.attackPower + " damage");
    this.increaseAttack();
};


Character.prototype.counterAttack = function (Obj) {
    Obj.healthPoints -= this.counterPower;
    $("#msg").append("<br>" + this.name + " countered " + this.counterPower + " damage");
};


function initCharacters() {
    var han = new Character("Han Solo", 320, 17, 25, "./assets/images/han.jpg");
    var yoda = new Character("Yoda", 290, 20, 35, "./assets/images/yoda.jpg");
    var jango = new Character("Jango Fett", 325, 18, 25, "./assets/images/jango.jpg");
    var vader = new Character("Darth Vader", 335, 19, 30, "./assets/images/vader.jpg");
    charArray.push(han, yoda, jango, vader);
}


function setBaseAttack(Obj) {
    baseAttack = Obj.attackPower;
}


function isAlive(Obj) {
    if (Obj.healthPoints > 0) {
        return true;
    }
    return false;
}


function isWinner() {
    if (charArray.length == 0 && player.healthPoints > 0)
        return true;
    else return false;
}


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
        $(divID + " div:last-child").append();

    }
}


function updatePics(fromDivID, toDivID) {
    $(fromDivID).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(toDivID).append("<img />");
        $(toDivID + " img:last-child").attr("id", charArray[i].name);
        $(toDivID + " img:last-child").attr("src", charArray[i].pic);
        $(toDivID + " img:last-child").attr("width", 150);
        $(toDivID + " img:last-child").attr("height", 200);
        $(toDivID + " img:last-child").addClass("img-thumbnail");
    }
}


function playAudio() {
    var audio2 = new Audio("assets/media/cantina-song.mp3");
    audio2.play();
}


function changeView() {
    $("#startScreen").empty();
    $("#fightScreen").show();
}


$(document).on("click", "img", function () {
    if (playerSelected && !defenderSelected && (this.id != player.name)) {
        for (var j = 0; j < charArray.length; j++) {
            if (charArray[j].name == (this).id) {
                defender = charArray[j]; 
                charArray.splice(j, 1);
                defenderSelected = true;
                $("#msg").html("Click to attack!");
            }
        }
        $("#defender").append(this); 
        $("#defender").append("<br>" + defender.name);
        $("#defenderHealth").append("HP: " + defender.healthPoints);
        
    }

if (!playerSelected) {
    for (var i = 0; i < charArray.length; i++) {
        if (charArray[i].name == (this).id) {
            player = charArray[i]; 
            playAudio();
            $("body").css({
                "background-image": "url('./assets/images/" + this.id[0] + ".jpg')"
            }); 
            setBaseAttack(player);
            charArray.splice(i, 1);
            playerSelected = true;
            changeView();
            $("#msg").html("Choose your opponent!");
        }
    }
    updatePics("#game", "#defendersLeft");
    $("#player").append(this); 
    $("#player").append(player.name);
    $("#playerHealth").append("HP: " + player.healthPoints);
    
}

});


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
                $(document).on("click", "#attackBtn", function () { 
                    location.reload();
                });
            }
        }
        if (!isAlive(defender)) {
            $("#defender").children().remove();
            $("#defender").html("");
            $("#defenderHealth").html("");
            defenderSelected = false;
            if (isWinner()) {
                
                $("#winnerMsg").show();
                $("#attackBtn").html("Play Again");
                $(document).on("click", "#attackBtn", function () { 
                    location.reload();
                });    
            }
        }
    }
});


$(document).ready(function () {
    $("#fightScreen").hide();
    $("#winnerMsg").hide();
    initCharacters();
    characterCards("#game");
});