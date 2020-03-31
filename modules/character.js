module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "character", character);
    }
}

character = (info) => {
    db.Player.findOne({where: {id: info.message.author.id}, include: [db.Ability, db.Job] }).then((player) => {
        if (!player) {info.message.channel.send("You don't have a character. Use start to create one."); return;}

        let abilitiesList = '';

        for (ability in player.Abilities) {
            abilitiesList += `${player.Abilities[ability].emoji} ${player.Abilities[ability].name} - ${player.Abilities[ability].description}  \n`;
        }

        info.message.channel.send(
            new Discord.RichEmbed().addField(`${info.message.author.tag}`, `${player.Jobs[0].name}`)
            .addField("Stats",`HP: ${player.max_health}\nAttack: ${player.attack}\nDefense: ${player.defense}`,true)
            .addField("Abilities", abilitiesList + "🏃 Run Away",true)
        )
    })

}