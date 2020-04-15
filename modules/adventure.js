const moment = require('moment');
playerHelpers = require('../helpers/player.js');

module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "adventure", adventure);
        bot.add_command(bot, "a", adventure);
    }
}

adventure = (info) => {
    db.Player.findOne({where: {id: info.message.author.id}, include: [db.Adventure, db.Job]}).then(player => {
        if (!player) {info.message.channel.send("You don't have a character. Use start to create one."); return;}
        
        let playerName = info.bot.users.get(player.id).username;
        // check if this player is already on an adventure
        if (player.Adventures.length) {
            var adventure = player.Adventures[0];
            let expiry = moment(adventure.PlayerAdventure.expiry);
            
            // the adventure is complete
            if (moment().isAfter(expiry)) {
                
                completeMsg = new Discord.RichEmbed()
                    .setTitle(`${playerName}'s adventure is complete!`)
                    .addField(`Rank ${adventure.PlayerAdventure.rank} - ${adventure.title}`, `Your adventure is complete! You have gained amazing rewards!`)
                    .addField("**Reward**",`${adventure.PlayerAdventure.expReward} exp\n${adventure.PlayerAdventure.goldReward} monies`, true)

                epicRewardCheck().then(epicReward => {
                    if (epicReward) {
                        completeMsg.addField("**Epic Reward**",`**${epicReward.name}**`, true)
                    }
                })

                // give player exp and possibly new level if they level up
                playerHelpers.gainExp(player, adventure.PlayerAdventure.expReward);

                // destroy this adventure
                db.PlayerAdventure.destroy({where:{PlayerId: player.id}});
                info.message.channel.send(completeMsg)

                return;

            // the adventure is still in progress
            } else {
                info.message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`${playerName}'s adventure progress`)
                    .addField(`Rank ${adventure.PlayerAdventure.rank} - ${adventure.title}`, `${adventure.description}`)
                    // .addField("Reward",`${adventure.PlayerAdventure.expReward} exp\n${adventure.PlayerAdventure.goldReward} monies`, true)
                    // .addField("Potential Epic Reward",`${adventure.PlayerAdventure.rareChance}% chance`, true)
                    .addField("Time Remaining",`${moment.duration(expiry.diff(moment())).humanize()}`, true)
                )
                return;
            }
        
        // generate and save a new adventure for this player
        } else {
            
            if (!info.msg) {
                info.message.channel.send(`Please use **${config.prefix}adventure <level>**\nYour recommended adventure level: ${player.Jobs[0].PlayerJob.level}`); return;
            }

            let rank = info.msg;
            let rareChance = 5;
            let expReward = Math.ceil(rank * (Math.random() * 100));
            let goldReward = Math.ceil(rank * (Math.random() * 30));
            let expiry = moment().add((player.Jobs[0].PlayerJob.level * (Math.random() * 15)) * rank, 'minutes');

            db.Adventure.findOne({ order: db.sequelize.random() })
            .then((adventure) => {
                db.PlayerAdventure.create({
                    PlayerId: player.id,
                    AdventureId: adventure.id,
                    expiry: expiry.toDate(),
                    rank: info.msg,
                    expReward: expReward,
                    goldReward: goldReward,
                    rareChance: rareChance
                });
                info.message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`${playerName}'s rank ${rank} adventure begins!`)
                    .addField(`Rank ${rank} - ${adventure.title}`, `${adventure.description}`)
                    // .addField("Reward",`${expReward} exp\n${goldReward} monies`, true)
                    // .addField("Potential Epic Reward",`${rareChance}% chance`, true)
                    .addField("Time Remaining",`${moment.duration(expiry.diff(moment())).humanize()}`, true)
                )
            })
        }
    })
}

epicRewardCheck = () => {
    return new Promise((resolve, reject) => {
        // does this player deserve an epic reward?
        let roll = Math.random();
        console.log('player chance: ' + adventure.PlayerAdventure.rareChance + ' || roll: ' + roll)

        if (roll < adventure.PlayerAdventure.rareChance) {
        // if (Math.random() < adventure.PlayerAdventure.rareChance) {
            globalHelpers.createRandomWeapon().then(epicReward => {
                db.Player.findOne({where: {id: info.message.author.id}, include: [db.Inventory]}).then(player => {
                    player.addInventory(epicReward.id);

                    resolve(epicReward)
                })
            });
        }
    })
}