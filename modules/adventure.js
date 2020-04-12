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
        
        // check if this player is already on an adventure
        if (player.Adventures.length) {
            var adventure = player.Adventures[0];
            let expiry = moment(adventure.PlayerAdventure.expiry);
            
            // the adventure is complete
            if (moment().isAfter(expiry)) {

                // // does this player deserve an epic reward?
                // if (Math.random() < adventure.PlayerAdventure.rareChance) {
                //     let epicReward = globals.createRandomWeapon();
                // }

                let epicReward = globals.createRandomWeapon();

                info.message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`${info.message.author.tag}'s Adventure Complete!`)
                    .addField(`Rank ${adventure.PlayerAdventure.rank} - ${adventure.title}`, `Your adventure is complete! You have gained amazing rewards!`)
                    .addField("**Reward**",`${adventure.PlayerAdventure.expReward} exp\n${adventure.PlayerAdventure.goldReward} monies`, true)
                    .addField("**Epic Reward**",`**${epicReward}**`, true)
                )
                    
                // give player new gear if they proc an item reward
                // playerHelpers.gainInventory(player, epicReward);

                // give player exp and possibly new level if they level up
                playerHelpers.gainExp(player, adventure.PlayerAdventure.expReward);
                
            // destroy this adventure
                db.PlayerAdventure.destroy({where:{PlayerId: player.id}});
                return;

            // the adventure is still in progress
            } else {
                info.message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`${info.message.author.tag}'s Adventure Progress`)
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
                info.message.channel.send(`Please use **!adventure <level>**\nYour recommended adventure level: ${player.Jobs[0].PlayerJob.level}`); return;
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
                    .setTitle(`${info.message.author.tag}'s Rank ${rank} Adventure Begins!`)
                    .addField(`Rank ${rank} - ${adventure.title}`, `${adventure.description}`)
                    // .addField("Reward",`${expReward} exp\n${goldReward} monies`, true)
                    // .addField("Potential Epic Reward",`${rareChance}% chance`, true)
                    .addField("Time Remaining",`${moment.duration(expiry.diff(moment())).humanize()}`, true)
                )
            })
        }
    })
}