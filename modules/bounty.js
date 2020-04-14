module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "bounty", bounty);
        bot.add_command(bot, "b", bounty);
    }
}

bounty = (info) => {
    db.Player.findOne({where: {id: info.message.author.id}, include: [db.Job]}).then(currentPlayer => {
        if (!currentPlayer) {info.message.channel.send("You don't have a character. Use start to create one."); return;}
        db.Player.findAll({
            order: db.sequelize.random(),
            include: [db.Job, {
                model: db.Job,
                through: { where: {
                    level: 1
                } }
            }],
            where: {id: { [db.Op.not]: info.message.author.id}},
            limit: 3
        }).then((targetPlayers) => {
            // did we find a bounty target?
            if (targetPlayers.length == 0 ) {
                info.message.channel.send("Sorry, no bounties available right now!");
            } else {
                embed = new Discord.RichEmbed().setTitle(`Bounty Targets Found!`);

                targetPlayers.forEach( (player, index, arr) => {
                    let discordPlayer = info.bot.users.get(player.id)
                    let playerName = discordPlayer ? discordPlayer.username : "testPlayer";
                    let icon = '';
                    if(index == 0) { icon = ':one:' } else if(index == 1) { icon = ':two:' } else {icon = ':three:'}
                    embed.addField(`${icon} ${playerName}`, `this is a badass level ${player.Jobs[0].PlayerJob.level} ${player.Jobs[0].name}\nReward: 50 monies`, true)  
                })
                
                embed.setDescription(`Which target would you like to hunt?`)
                info.message.channel.send(embed)
                .then((message) => {
                    messageHelpers.addMultipleReactions(message, [':one:', ':two:', ':three:']);
                    messageHelpers.collectFirstReaction(info, message, [':one:', ':two:', ':three:'], info.message.author.id).then((reaction) => {
                        if (reaction == false) {
                            // message timed out, no reply!
                            info.message.channel.send('You did not choose a target!')
                        } else {

                            info.message.channel.send('You picked a target!')
                        }
                    })
                })
            }
        })
    })
}