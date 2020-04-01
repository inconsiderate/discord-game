const moment = require('moment');

module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "adventure", adventure);
    }
}

adventure = (info) => {
    db.Player.findOne({where: {id: info.message.author.id}, include: [db.Adventure, db.Job]}).then(player => {
        if (!player) {info.message.channel.send("You don't have a character. Use start to create one."); return;}
        let expiry = moment(player.Adventures[0].PlayerAdventure.expiry);

        // check if this player is already on an adventure
        if (player.Adventures.length) {
            
            // adventure is complete
            if (moment().isAfter(expiry)) {
                info.message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`${info.message.author.tag}'s Adventure Complete!`)
                    .addField(`${player.Adventures[0].title}`, `Your adventure is complete! You have gained all the amazing rewards!`)
                    .addField("Rewards",`100 exp\n50GP\nSword of Smashing +3`, true)
                )

                db.PlayerAdventure.destroy({where:{PlayerId: player.id}});
                return;

            // adventure still in progress
            } else {

                info.message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`${info.message.author.tag}'s Adventure Progress`)
                    .addField(`${player.Adventures[0].title}`, `${player.Adventures[0].description}`)
                    .addField("Rewards",`100 exp\n50GP\nSword of Smashing +3`, true)
                    .addField("Time Remaining",`${moment.duration(expiry.diff(moment())).humanize()}`, true)
                )

                return;
            }
        
        // else generate and save new adventure for player
        } else {
            db.Adventure.findOne()
            .then((adventure) => {
                db.PlayerAdventure.create({
                    PlayerId: player.id,
                    AdventureId: adventure.id,
                    expiry: moment().add(player.Jobs[0].PlayerJob.level * 4, 'minutes').toDate()
                });
                info.message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`${info.message.author.tag}'s Adventure Begins`)
                    .addField(`${adventure.title}`, `${adventure.description}`)
                    .addField("Rewards",`100 exp\n50GP\nSword of Smashing +3`, true)
                    .addField("Time Remaining",`${moment.duration(expiry.diff(moment())).humanize()}`, true)
                )
            })
        }
    })
}