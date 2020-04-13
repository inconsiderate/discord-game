const moment = require('moment');

module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "dungeon", dungeon);
        bot.add_command(bot, "d", dungeon);
    }
}

scenes = {
    0: {title:"the cave entrance"},
    1: {title:"an ominous hallway"},
    2: {title:"the shore of an underground lake"},
    3: {title:"bosses lair"},
}

// combat loop basically works like this
//
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
    // initialize empty combat state
    combatState = {
        turnOrder: [],
        partyPower: 0,
        partyDefense: 0,
        partyHealth: 0,
        partyMaxHealth: 0,
        combatLog: '',
        players: []
    }

    // set up health pool for group, determine power level, select dunegon scenes
    prepareDungeon(info, combatState).then( async (result) => {
        if (result == false) {
            // problem was found - do not start dungeon
            return false;
        } 

        for (scene in scenes) {
            if (sceneTransition(info, combatState, scenes[scene], scenes[scene - 1])) {
                // choose an appropriate enemy for this party
                await prepareNewEnemy(combatState);
                // present the party with the new scene
                await sceneResolution(info, combatState);
            } else {
                dungeonEnd(info, scene);
                break;
            };
        };
    })
}

dungeonEnd = (info, scene) => {
    if (combatState.partyHealth < 1) {
        info.message.channel.send("You are dead. LOLOLOLOL Wow you suck.");
        return false;
    } 

    info.message.channel.send("Dungeon Complete Placeholder!");
    return;
};

sceneTransition = (info, combatState, currentScene, previousScene) => {
    if (combatState.partyHealth < 1) {
        return false;
    } 

    if (previousScene) {
        combatState.combatLog = `You have left ${previousScene.title}, and entered ${currentScene.title}\n`
    } else {
        appendToCombatLog(combatState.combatLog, `You have entered ${currentScene.title}!\n`);
    }

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

        let continueDungeon = true;
        db.Player.findAll({where: {id: playerIds}, order: ['speed'], include: [db.Ability] }).then( async (players) => {    
            // do we have a player result for each ID?
            if (players.length != playerIds.length) {
                info.message.channel.send("One of the people you selected does not have a character!");
                continueDungeon = false;
            } else {
                players.forEach(function(player) {
                    // are any of the players already in an active dungeon?
                    if (player.activeDungeon != null) {
                        // if it's been long enough, clear this players dungeon cooldown
                        if (moment().isAfter(moment(player.activeDungeon))) {
                            info.message.channel.send(`<@${player.id}> - It's been more than ${globals.dungeonCooldownMinutes} minutes since your last dungeon was activated. Clearing your cooldown timer! -- (remove this message once player cooldowns are visible on character sheet)`);
                            player.update({activeDungeon: null})
                        } else {
                            // player started a dungeon less than 5 minutes ago
                            info.message.channel.send(`<@${player.id}> - You're either in an active dungeon or still on cooldown! Return to it, or wait ${moment.duration(moment().diff(moment(player.activeDungeon))).humanize()} to start a new one.`);
                            continueDungeon = false;
                        }
                    }
                })

                if (continueDungeon) {
                    players.forEach(function(player) {
                        combatState.partyHealth += player.current_health;
                        combatState.partyPower += player.attack;
                        combatState.partyDefense += player.defense;
                        combatState.players.push(player);

                        // player does not have an active dungeon. Make this one active!
                        player.update({activeDungeon: moment().add(globals.dungeonCooldownMinutes, 'minutes').toDate()})
                    })
                }

                // set party starting health and attack power
                // this can be better later, but right now we just need numbers
                combatState.partyPower = (combatState.partyPower / players.length);
                combatState.partyDefense = (combatState.partyDefense / players.length);
                combatState.partyHealth = (combatState.partyHealth / players.length);
                combatState.partyMaxHealth = combatState.partyHealth;
            }
            
            resolve(continueDungeon);
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

            appendToCombatLog(combatState.combatLog, `You are attacked by a ${combatState.enemy.name}!\n`);

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
        let playerName = info.bot.users.get(player.id).username;
        info.message.channel.send(
            new Discord.RichEmbed().addField("Battle Log",`${combatState.combatLog}`)
            .addField("Stats",`**${combatState.enemy.name} HP: ${combatState.enemy.health}/${combatState.enemy.maxHealth}**\n Party HP: ${combatState.partyHealth}/${combatState.partyMaxHealth}\nParty Power: ${combatState.partyPower}\nParty Defense: ${combatState.partyDefense}`,true)
            .addField(`What will you do?`, player.actions.text,true)
            .setTitle(`It's your turn ${playerName}!`)
        ).then((message) => {
            messageHelpers.addMultipleReactions(message, player.actions.icons);
            messageHelpers.collectFirstReaction(info, message, player.actions.icons, player.id).then((reaction) => {
                if (reaction == false) {
                    // message timed out, no reply!
                    appendToCombatLog(combatState.combatLog, `${playerName} did not take any action!`);
                    resolve();
                } else {
                    db.Ability.findOne({where: {emoji: reaction.emoji.name}})
                    .then(function (selectedAbility) {
                        
                        console.log("player used ability: " + selectedAbility.name);
                        let combatText = '';
                        if (selectedAbility.damageType) {
                            let damage = Math.max((selectedAbility.rank * combatState.partyPower) + Math.floor(Math.random() * 10) == 1 ? 1 : 4);
                            combatState.enemy.health -= damage;
                            combatText = `for ${damage} points of physical damage!`
                        }
                        appendToCombatLog(combatState.combatLog, `${playerName} ${selectedAbility.combatLogText} ${combatState.enemy.name} ${combatText}`);

                        resolve();
                    })
                }
            })
        })
    })
}

resolveEnemyAttack = (combatState, status) => {
    // save effects to current health totals and status of player & enemy
    // append current damage totals to combatLog
    // returns combatLog with description of attack results
    combatState.partyHealth -= 3;
    appendToCombatLog(combatState.combatLog, `${combatState.enemy.name} attacks the party with Bite for 3 damage!\n`);
}

appendToCombatLog = (combatLog, newCombatText) => {
    // trim log down to max lines then add new line
    if (combatLog.split(/\r\n|\r|\n/).length > globals.dungeonCombatLogLineLimit) {
        combatState.combatLog = combatLog.substring(combatLog.indexOf("\n") + 1);
    }
    combatState.combatLog += `${newCombatText}`;

    return;
}