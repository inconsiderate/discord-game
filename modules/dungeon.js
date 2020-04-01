module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "dungeon", dungeon);
    }
}

scenes = {
    0: {title:"cave entrance"},
    1: {title:"hallway"},
    2: {title:"underground lake"},
    3: {title:"boss lair"},
}

combatState = {
    turnOrder: [],
    partyPower: 0,
    partyHealth: 0,
    partyMaxHealth: 0,
    combatLog: '',
    players: []
}

// 1. decides which character goes first
// 2. [loop for all attacking characters in their order]
// a) call attack function
//  i) call damage calculating function? (returns default attack text)
//  ii) return log text
// b) append text to log
// 3. loop for all characters with status
// a) call status function
//  i) perform status
//  ii) return status text
// b) append to log

dungeon = (info) => {
    console.log("STARTING DUNGEON");
    // set up health pool for group, determine power level, select dunegon scenes
    prepareDungeon(info, combatState).then( async () => {
        for (scene in scenes) {
            if (sceneTransition(info, combatState, scenes[scene], scenes[scene - 1])) {
                // choose an appropriate enemy for this party
                await prepareNewEnemy(combatState);
                // present the party with the new scene
                await sceneResolution(info, combatState);
            } else {
                dungeonEnd(scene);
            };
        };
    })
}

sceneTransition = (info, combatState, currentScene, previousScene) => {
    if (combatState.partyHealth < 1) {
        info.message.channel.send("Your whole party is dead LOLOLOLOL!");
        return false;
    } 

    if (previousScene) console.log(`Previous Scene: ${previousScene.title}`);
    console.log(`Current Scene: ${currentScene.title}. Continue to the next scene? YES.`);

    // info.message.channel.send(
    //     new Discord.RichEmbed().addField("Battle Log",`${combatState.combatLog}`)
    //     .addField("Stats",`${combatState.enemy.name} HP: ${combatState.enemy.health}/${combatState.enemy.maxHealth}\n Party HP: ${combatState.partyHealth}/${combatState.partyMaxHealth}\nAtk ${player.attack} - Def ${player.defense}`,true)
    //     .addField(`What will you do?`, player.actions.text,true)
    //     .setTitle(`It's your turn <@${player.id}> !`)
    //     .setFooter(`It's your turn <@${player.id}> !`)
    // ).then((message) => {
    //     helper.addMultipleReactions(message, player.actions.icons);
    //     helper.collectFirstReaction(info, message, player.actions.icons).then((reaction) => {
    //         db.Ability.findOne({where: {emoji: reaction.emoji.name}})
    //         .then(function (selectedAbility) {
    //             console.log("player used ability: " + selectedAbility.name);
    //             combatState.enemy.health -= 6;
    //             // return `You attack the enemy with ${selectedAbility.combatLogText} for 3 damage!`;
    //             appendToCombatLog(combatState.combatLog, `<@${player.id}> ${selectedAbility.combatLogText} ${combatState.enemy.name} for 6 damage!`);
    //             resolve();
    //         })
    //     })
    // })

    appendToCombatLog(combatState.combatLog, `\nYou have entered the ${currentScene.title}!`);

    return true;
}

sceneResolution = async (info, combatState) => {
    // loop until one side is dead
    while (combatState.partyHealth > 0 && combatState.enemy.health > 0) {
        for (player in combatState.turnOrder) {
            // only Enemy has Name attribute, so this is Enemy
            if (combatState.turnOrder[player].name) {
                console.log('enemy turn');
                // check if enemy has a status (poison take damage, frozen/sleeping skip turn, etc)
                // status = checkStatus(combatState, player);
                status = false;
                resolveEnemyAttack(combatState, status);
            } else {
                console.log('player turn');
                // check if player has a status
                // status = checkStatus(combatState, player);
                status = false;
                await resolvePlayerTurn(info, combatState, combatState.turnOrder[player], status);
            }
        }
    }

    return combatState.partyHealth;
}

prepareDungeon = (info, combatState) => {
    console.log("Preparing Dungeon");
    return new Promise((resolve, reject) => {

        let playerIdsArray = [];
        if (info.msg) {
            // strip players input down to discord IDs
            let playerIdsString = info.msg.replace(/<|!|>|@/g, "")
            playerIdsArray = playerIdsString.split(" ");
        }

        // add author to the list of players
        playerIdsArray.push(info.message.author.id);
        const playerIds = [...new Set(playerIdsArray)];

        db.Player.findAll({where: {id: playerIds}, order: ['speed'], include: [db.Ability] }).then( async (players) => {            
            if (!players.length) {
                info.message.channel.send("One of the people you selected does not have a character!");
                return;
            }

            // set party starting health and attack power
            for (player in players) {
                combatState.partyHealth += players[player].current_health;
                combatState.partyPower += players[player].attack;
                combatState.players.push(players[player]);
            }

            // this can be more elaborate later, but right now we just need a number
            combatState.partyPower = (combatState.partyPower / players.length);
            combatState.partyHealth = (combatState.partyHealth / players.length);
            combatState.partyMaxHealth = combatState.partyHealth;

            resolve();
        })
    })
}

prepareNewEnemy = (combatState) => {
    console.log("Preparing New Enemy");
    return new Promise((resolve, reject) => {
        db.Enemy.findOne({ order: db.sequelize.random() }).then((enemy) => {
            combatState.enemy = enemy;
            for (player in combatState.players) {

                // sort players and enemy by speed
                if (combatState.players[player].speed > enemy.speed || !combatState.turnOrder.includes(enemy)) {
                    combatState.turnOrder.push(combatState.players[player]);
                } else {
                    combatState.turnOrder.push(enemy);
                }
            }

            // if all the players are crazy fast, add enemy to end of turnOrder
            if (!combatState.turnOrder.includes(enemy)) {
                combatState.turnOrder.push(enemy);
            }
            combatState.enemy.maxHealth = combatState.enemy.health;

            appendToCombatLog(combatState.combatLog, `You are attack by a ${combatState.enemy.name}!`);

            resolve();
        })

    })
}

resolvePlayerTurn = (info, combatState, player, status) => {

    return new Promise((resolve, reject) => {

        // prepare player abilities
        let abilitiesIcons = [];
        let abilitiesList = '';

        for (ability in player.Abilities) {
            console.log()
            abilitiesIcons.push(player.Abilities[ability].emoji);
            abilitiesList += `${player.Abilities[ability].emoji} ${player.Abilities[ability].name}\n`;
        }

        player.actions = {};
        player.actions.text = abilitiesList;
        player.actions.icons = abilitiesIcons;

        info.message.channel.send(
            new Discord.RichEmbed().addField("Battle Log",`${combatState.combatLog}`)
            .addField("Stats",`${combatState.enemy.name} HP: ${combatState.enemy.health}/${combatState.enemy.maxHealth}\n Party HP: ${combatState.partyHealth}/${combatState.partyMaxHealth}\nAtk ${player.attack} - Def ${player.defense}`,true)
            .addField(`What will you do?`, player.actions.text,true)
            .setTitle(`It's your turn <@${player.id}> !`)
            .setFooter(`It's your turn <@${player.id}> !`)
        ).then((message) => {
            helper.addMultipleReactions(message, player.actions.icons);
            helper.collectFirstReaction(info, message, player.actions.icons).then((reaction) => {
                db.Ability.findOne({where: {emoji: reaction.emoji.name}})
                .then(function (selectedAbility) {
                    
                    console.log("player used ability: " + selectedAbility.name);
                    let combatText = '';
                    if (selectedAbility.damageType) {
                        let damage = Math.max((selectedAbility.rank * combatState.partyPower) + Math.floor(Math.random() * 2) == 1 ? 1 : -1);
                        combatState.enemy.health -= damage;
                        combatText = `for ${damage} points of physical damage!`
                    }
                    appendToCombatLog(combatState.combatLog, `<@${player.id}> ${selectedAbility.combatLogText} ${combatState.enemy.name} ${combatText}`);

                    resolve();
                })
            })
        })
    })
}

resolveEnemyAttack = (combatState, status) => {
    // save effects to current health totals and status of player & enemy
    // append current damage totals to combatLog
    // returns combatLog with description of attack results
    combatState.partyHealth -= 3;
    appendToCombatLog(combatState.combatLog, `${combatState.enemy.name} attacks the party with Bite for 3 damage!`);
}

appendToCombatLog = (combatLog, newCombatText) => {
    // trim log down to max lines then add new line
    if (combatLog.split(/\r\n|\r|\n/).length > 6) {
        combatLog = combatLog.substring(combatLog.indexOf("\n") + 1);
    }
    combatState.combatLog += `${newCombatText}\n`;

    return;
}