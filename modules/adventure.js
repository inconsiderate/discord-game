module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "adventure", adventure);
    }
}

adventure = (info) => {
    db.Player.findOne({where: {id: info.message.author.id}, include: [db.Adventure]}).then(player => {
        if (!player) {info.message.channel.send("You don't have a character. Use start to create one."); return;}

        // check if this player is already on an adventure
        if (player.Adventures.length) {
            info.message.channel.send("YOU ARE ALREADY ON AN ADVENTURE, HERE IS YOUR PROGRESS."); return;
        } else {
            db.Adventure.findOne()
            .then((adventure) => {
                db.PlayerAdventure.create({
                    PlayerId: player.id,
                    AdventureId: adventure.id,
                    expiry: new Date().setHours(new Date().getHours() + 1)
                });
                info.message.channel.send(
                    new Discord.RichEmbed()
                    .setTitle(`Adventure Started`)
                    .addField(`${adventure.title}`, `${adventure.description}`)
                    .addField("Time Remaining",`1 hour`)
                )
            })
        }
    })
}