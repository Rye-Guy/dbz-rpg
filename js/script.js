//jquery fun!!!
$(document).ready(function(){
        
//an object that contains all the charcters
    var charcters = {
        'goku': {
            name: 'goku',
            health: 150,
            attack: 12,
            counterAtt: 20, 
            image: "images/"
        },
        'krillin':{
            name: 'krillin',
            health: 200,
            attack: 8,
            counterAtt: 15, 
            image: "images/"
        },
        'vegeta':{
            name: 'vegeta',
            health: 170,
            attack: 16,
            counterAtt: 15, 
            image: "images/"
        },
        'frieza':{
            name: 'frieza',
            health: 220,
            attack: 14,
            counterAtt: 20, 
            image: "images/"
        }
    }

//lets makes some globals.
var selectedCharcter; 
var defender; 
var enemies = [];
var indexOfCharcter;
var attackPhase;
var turns = 1;
var enemiesDefeated = 0; 

//function that creates the initial content with the charcters adding in images and names dynamicly

var createContent = function(charcter, contentArea, charName){
    var charArea = $("<div class='charcter' data-name='" + charcter.name + "'>");
    var charName =  $("<div class='charcter-name'>").text(charcter.name);
    var charImg = $("<img alt='image' class='charcter-img'>").attr("src", charcter.image);
    var charHealth = $("<div class='charcter-health'>").text(charcter.health);
    charArea.append(charName).append(charImg).append(charHealth);
    $(contentArea).append(charArea);

    if(charName == 'enemy'){
        $(charArea).addClass('enemy');
    }else if (charName == 'defender'){
        defender = charcter;
        $(charDiv).addClass('target');
    }
};
//function that creates the messages area for the user.
    var createMessage = function(message){
        var messageDefault = $("#messageArea");
        var newMessage = $("<div>").text(message);
        messageDefault.append(newMessage);

//if statement that helps control when the text area needs to be cleared
        if(message == 'clearMessage'){
            messageDefault.text('');
        }
    };

    var createCharcters = function(charObj, makeContent){
            //all the characters on the page
            if(makeContent == '#charcters-section'){
                $(makeContent).empty();
            for(var key in charObj){
                if (charObj.hasOwnProperty(key)){
                    createContent(charObj[key], makeContent, '')
                    }
                }
            }
            //player selected character 
        if(makeContent == '#selected-character'){
            $('#selected-charcter').prepend("Your Character");
            createContent(charObj, makeContent, '');
            $('#attack-button').css('visibility', 'visable');
        }
            //others oppents turn into enemies
        if(makeContent == '#available-to-attack-section'){
            $('#available-to-attack-section').prepend("Choose Your Next Opponent");
            
            for(var i = 0; i < charObj.length; i++){

                createContent(charObj[i], makeContent, 'enemy');
            }
            //move enemy to defend area
            $(document).on('click', '.enemy', function(){
                //the selected oppoent to fight
                name = ($(this).data('name'));
            // functioniality for when there is no defender in the area
                if ($('#defender').children().length == 0){
                    createCharcters(name, '#defender');
                    $(this).hide();
                    createMessage("clearMessage");
                }
            });
        }

        //create defender
        if(makeContent == '#defender'){
            $(makeContent).empty();
        for (var i = 0; i < enemies.length; i++){
            //add combant to the defender area
            if(enemies[i].name == charObj){
                $('#defender').append("Your selected oppoenent")
                createContent(enemies[i], makeContent, 'defender');
                }
            }
        }
        //upadte page when defender is attacked
        if (makeContent == 'playerDamage'){
            $('#defender').empty();
            $('#defender').append("Your Selected Oppenent")
            createContent(charObj, '#defender', 'defender');
            }

        if (makeContent == 'enemyDamage'){
            $('#selected-charcter').empty();
            createContent(charObj, '#selected-charcter', '');
            }
        if (makeContent == 'enemyDefeated'){
            $('#defender').empty();
            var playerDefeatMessage = "You have eliminated " + charObj.name + ". Others seem to have an eye on you, so look out!";
            createMessage(playerDefeatMessage);
        }
    };
//allows user to select a charcter
    createCharcters(charcters, '#characters-section');
    $(document).on('click', '.character', function(){
        name = $(this).data('name');
        //if we dont have one selected yet
        if(!selectedCharcter){
            selectedCharcter = charcters[name];
            for (var key in charcters){
                if(key != name){
                    enemies.push(charcters[key]);
                }
            }
        $('#characters-section').hide();
        createCharcters(selectedCharcter, '#selected-charcter');
        createCharcters(enemies, '#available-to-attack-section');    
        }
    });

    //section for contorlling what happens when the user starts playing the game
    $('#attack-button').on("click", function(){
        if($('#defender').children().length !== 0){
    //attack phase control
            var attackMessage = "You attacked" + defender.name + "for" + (selectedCharcter.attack * turns) + " damage.";
            createMessage("clearMessage");
            defender.health = defender.health - (selectedCharcter.attack * turns);
        
        if(defender.health > 0){
            createCharcters(defender, 'playerDamage');
            var counterAttMessage = defender.name + " attack you for " + defender.counterAtt + " damage";
            createMessage(attackMessage);
            createMessage(counterAttMessage);
        
        selectedCharcter.health = selectedCharcter.health - defender.counterAtt;
        createCharcters(selectedCharcter, 'enemyDamage');
        if(selectedCharcter.health <= 0){
            createMessage('clearMessage');
            restartGame("You have a been defeat by " + defender.name);
            $("#attack-button").unbind("click")
             }
        }else{
            createCharcters(defender, 'enemyDefeated');
            killCount++;
            if (killCount >= 3){
                createMessage("clearMessage");
                restartGame("You have proven your the stronges in the UNIVERSE! YOU WIN!!!");
            }
        }
        turnCounter++;
        }else{
            createMessage("clearMessage");
            createMessage("No one to fight...yet")
        }
    });

    var restartGame = function(input){
        var restart = $('<button>Restart</button>').click(function(){
            location.reload();
        });
        var gameState = $("<div>").text(input);
        $("gameMessage").append(gameState);
        $("gameMessage").append(restart);
    };
});
//start with an array of our charcters