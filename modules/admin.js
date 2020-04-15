module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "giveexp", giveExp);
        bot.add_command(bot, "giveitem", giveRandomItem);
        bot.add_command(bot, "init", init);
        bot.add_command(bot, "fake", fakePlayers);
    }
}

// give X exp to player
function giveExp(info) {
    console.log(info.admin);
	if (info.admin) {

        if (!info.msg) {
            info.message.channel.send(`Please use **${config.prefix}giveexp <@player>** for this command`); return;
        }

		try{
			eval(info.msg);
		} catch (e) {
			console.log(e);
		}
	}
}


// give X item to player as if they looted it
function giveRandomItem(info) {
	if (info.admin) {
        if (!info.msg) {
            info.message.channel.send(`Please use **${config.prefix}giveitem <rank>** for this command`); return;
        }
		try{
            globalHelpers.createRandomWeapon().then(epicReward => {
                console.log('finding player')
                db.Player.findOne({where: {id: info.message.author.id}, include: [db.Inventory]}).then(player => {
                    player.addInventory(epicReward.id);
                    console.log('added to player inventory')
                })
            });
        } catch (e) {
			console.log(e);
		}
	}
}

// create a new player
function init(info) {
	if (info.admin) {
        if (!info.msg) {info.message.channel.send(`Please use **${config.prefix}init <jobId abilityId>** for this command`); return;}
        
		try{
            let input = info.msg.replace(/<|!|>|@/g, "")
            inputVars = input.split(" ");
            //inputVars[0] = jobId 
            //inputVars[1] = abilityId

            db.Job.findOne({where: {id: inputVars[0]} })
            .then(selectedJob => {
                console.log('found a job: ' + selectedJob.name)
                db.Ability.findOne({where: {id: inputVars[1]}})
                .then(selectedAbility => {
                    console.log('found an ability: ' + selectedAbility.name)
                    // create new player with Job and Ability
                    db.Player.create({ id: info.message.author.id})
                    .then(newPlayer => {
                        newPlayer.addAbility(1);
                        newPlayer.addAbility(selectedAbility);
                        newPlayer.addJob(selectedJob);
                        console.log("NEW PLAYER CREATED: ", newPlayer.id);
                        
                        info.message.channel.send(`${info.message.author.tag} is now a Level 1 ${selectedJob.name} with ${selectedAbility.name}!`);
                    })
                })
            })

		} catch (e) {
			console.log(e);
		}
	}
}

// create a bunch of fake players
function fakePlayers(info) {
	if (info.admin) {
        
        console.log("making new players")

        db.Job.findOne({where: {id: 2} })
        .then(selectedJob => {
            console.log('found a job: ' + selectedJob.name)
            db.Ability.findOne({where: {id: 4}})
            .then(selectedAbility => {
                console.log('found an ability: ' + selectedAbility.name)
                // create new player with Job and Ability
                db.Player.create({ id: "648556394433216537"})
                .then(newPlayer => {
                    newPlayer.addAbility(1);
                    newPlayer.addAbility(selectedAbility);
                    newPlayer.addJob(selectedJob);
                    console.log("NEW PLAYER CREATED: ", newPlayer.id);
                })
            })
        })

	}
}
