//jquery fun!!!
$(document).ready(function () {

    var themeSong = new Audio('assets/sounds/themeSong.mp3');
    var battleTheme = new Audio('assets/sounds/battleTheme.mp3');
    var startTheme = new Audio('assets/sounds/startTheme.mp3');
    var victorySound = new Audio('assets/sounds/victory.mp3');
    var missedPunch = new Audio('assets/sounds/meleemiss.mp3');
    var hitPunch = new Audio('assets/sounds/mediumpunch.mp3');
    var over9000 = new Audio('assets/sounds/over9000.mp3');

    startTheme.play();
    
    //an object that contains all the characters
    var characters = {
        'goku': {
            name: 'goku',
            health: 220,
            attack: 12,
            counterAtt: 28,
            image: "images/goku.png"
        },
        'krillin': {
            name: 'krillin',
            health: 260,
            attack: 8,
            counterAtt: 22,
            image: "images/krillin.png"
        },
        'vegeta': {
            name: 'vegeta',
            health: 200,
            attack: 16,
            counterAtt: 30,
            image: "images/vegeta.png"
        },
        'frieza': {
            name: 'frieza',
            health: 180,
            attack: 18,
            counterAtt: 45,
            image: "images/frieza.png"
        }
    }

    //lets makes some globals.
    var selectedCharacter;
    var defender;
    var enemies = [];
    var turns = 1;
    var enemiesDefeated = 0;

    //function that creates the initial content with the characters adding in images and names dynamicly. Displays conent all togehter before user has made any selections. 

    var createContent = function (character, contentArea, makeChar) {

        var charArea = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImg = $("<img alt='image' class='character-img'>").attr("src", character.image);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charArea.append(charName).append(charImg).append(charHealth);
        $(contentArea).append(charArea);


        //makes classes for other selections from the user. When we call the function we want these to do their thang. 
        if (makeChar == 'enemy') {
            $(charArea).addClass('enemy');
        } else if (makeChar == 'defender') {
            defender = character;
            $(charArea).addClass('target');
        }
    };
    //function that is used to keep content updated as the game is played. this is called back alot to ensure that after every turn we update the content on the page.
    var createCharacters = function (charObj, makeContent) {
        //all the characters on the page
        if (makeContent == '#characters-section') {
            $(makeContent).empty();

            //for in loop to loop through the current character object and push other characters to the eneimes section.
            for (var key in charObj) {
                if (charObj.hasOwnProperty(key)) {
                    createContent(charObj[key], makeContent, '')
                }
            }
        }
        //player selected character 
        if (makeContent == '#selected-character') {
            createContent(charObj, makeContent, '');
            $('#attack-button').css('visibility', 'visable');
        }
        //others oppents turn into enemies
        if (makeContent == '#available-to-attack-section') {
         
            for (var i = 0; i < charObj.length; i++) {

                createContent(charObj[i], makeContent, 'enemy');
            }
            //move enemy to defend area
            $(document).on('click', '.enemy', function () {
                //the selected oppoent to fight
                name = ($(this).data('name'));
                // functioniality for when there is no defender in the area
                if ($('#defender').children().length == 0) {
                    createCharacters(name, '#defender');
                    $(this).hide();

                }
            });
        }

        //create defender
        if (makeContent == '#defender') {
            $(makeContent).empty();
            for (var i = 0; i < enemies.length; i++) {
                //add combant to the defender area
                if (enemies[i].name == charObj) {
              
                    createContent(enemies[i], makeContent, 'defender');
                }
            }
        }
        //upadte page when defender is attacked
        if (makeContent == 'playerDamage') {
            $('#defender').empty();
            $('#defender').append("");
            createContent(charObj, '#defender', 'defender');
        }

        if (makeContent == 'enemyDamage') {
            $('#selected-character').empty();
            createContent(charObj, '#selected-character', '');
        }
        if (makeContent == 'enemyDefeated') {
            $('#defender').empty();
        }
    };
    //creates a selected-character and moves the rest of the characters into the enemies array
    createCharacters(characters, '#characters-section');
    $(document).on('click', '.character', function () {
        startTheme.pause();
        battleTheme.play();
        $('.fight-area').css('display', 'flex');
        $('.main-heading').text('Select Your Opponent!');
        name = $(this).data('name');

        if (!selectedCharacter) {
            selectedCharacter = characters[name];
            //for in loop that checks to see who is and who isnts 
            for (var key in characters) {
                if (key != name) {
                    enemies.push(characters[key]);
                }
            }
            $('#characters-section').hide();
            createCharacters(selectedCharacter, '#selected-character');
            createCharacters(enemies, '#available-to-attack-section');
        }
    });

    //section for contorlling what happens when the user starts playing the game. Every click of the attack button runs to check the conditions of the current state of the game. 
    $('#attack-button').on("click", function () {
    
        if ($('#defender').children().length !== 0) {
            $('.main-heading').text('Battle!');
            $('.player-name').text(selectedCharacter.name);
            //damage calculation
            defender.health = defender.health - (selectedCharacter.attack * turns);
            hitPunch.play();
            $.alert({
                title: 'Fight!',
                theme: 'dark',
                content: selectedCharacter.name + " has hit " + defender.name + " for " + (selectedCharacter.attack * turns) + " damage<br><br>" + defender.name + " counters for " + defender.counterAtt,
            });
            //the end game conditions
            if (defender.health > 0) {
                //updates information to the page so user can see how much damage is left
                createCharacters(defender, 'playerDamage');
                createCharacters(selectedCharacter, 'enemyDamage');
                selectedCharacter.health = selectedCharacter.health - defender.counterAtt;

                if (selectedCharacter.health <= 0) {
                    battleTheme.pause();
                  
                    $('.overlay-lose').css('display', 'block');
                    $("#attack-button").unbind("click");
                }

            } else {
                createCharacters(defender, 'enemyDefeated');
                enemiesDefeated++;
                if (enemiesDefeated >= 3) {
                    battleTheme.pause();
                    over9000.play();
                    themeSong.play();
                    $('.overlay').css('display', 'block');
                    $('.player-health').text(selectedCharacter.health);
                }
            }
            //no matter the outcome after damage calculation increase the turn counter. Important for allowing the player to hit for attack points as the game progesses. 
            turns++;
            //condition just incase the user attacks nothing. 
        } else {
            missedPunch.play();
            $.alert({
                title: 'Embarrassing!',
                theme: 'dark',
                content: selectedCharacter.name + " has attacked the air, dealing no hit points to anyone. Hit points only taken to " + selectedCharacter.name + "'s ego",
            });
        }
    });
});