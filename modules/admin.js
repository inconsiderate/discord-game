module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "giveexp", giveExp);
        bot.add_command(bot, "giveitem", giveRandomItem);
        bot.add_command(bot, "init", init);
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
			eval(info.msg);
		} catch (e) {
			console.log(e);
		}
	}
}



// give X item to player as if they looted it
function init(info) {
	if (info.admin) {

        if (!info.msg) {
            info.message.channel.send(`Please use **${config.prefix}init <jobId abilityId>** for this command`); return;
        }
        
		try{
            let input = info.msg.replace(/<|!|>|@/g, "")
            inputVars = input.split(" ");
            //inputVars[0] = jobId 
            //inputVars[1] = abilityId

            db.Job.findOne({where: {id: inputVars[0]} })
            .then(selectedJob => {
                db.Ability.findOne({where: {id: inputVars[1]}})
                .then(selectedAbility => {
                    // create new player with Job and Ability
                    db.Player.create({ id: info.message.author.id})
                    .then(newPlayer => {
                        newPlayer.addAbility(1);
                        newPlayer.addAbility(selectedAbility);
                        newPlayer.addJob(selectedJob);
                        console.log("New player created: ", newPlayer.id);
                        
                        info.message.channel.send(`${info.message.author.tag} is now a Level 1 ${selectedJob.name} with ${selectedAbility.name}!`);
                    })
                })
            })

		} catch (e) {
			console.log(e);
		}
	}
}