module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "character", character);
        bot.add_command(bot, "c", character);
    }
}

character = (info) => {
    db.Player.findOne({where: {id: info.message.author.id}, include: [db.Ability, db.Job] }).then((player) => {

        if (!player) {info.message.channel.send("You don't have a character. Use start to create one."); return;}
        let abilitiesList = '', inventoryList = '';

        for (ability in player.Abilities) {
            abilitiesList += `${player.Abilities[ability].emoji} ${player.Abilities[ability].name} - ${player.Abilities[ability].description}\n`;
        }
        
        // for (item in player.Inventory) {
            // inventoryList += `${player.Inventory[item].equipped} ${player.Inventory[item].emoji} ${player.Inventory[item].name} - ${player.Inventory[item].description}  \n`;
            inventoryList = `418 monies\n+1 Throbbing Sword of The Eldest God\nShining Armor of Glancing Blows`;
        // }

        info.message.channel.send(
            new Discord.RichEmbed()
            .addField(`${info.message.author.tag}`, `Level ${player.Jobs[0].PlayerJob.level} ${player.Jobs[0].name}`, true)
            .addField(`Next Level`, `${player.Jobs[0].PlayerJob.exp}/${globals.expForNextLevel(player.Jobs[0].PlayerJob.level + 1)}`, true)
            .addField('Stats',`Health Points: ${player.max_health}\nAttack: ${player.attack}\nDefense: ${player.defense}`, true)
            .addField('Abilities', `${abilitiesList}`, true)
            .addField("Inventory", inventoryList)
        )
    })
}