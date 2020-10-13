module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "help", help);
        bot.add_command(bot, "adminhelp", adminHelp);
    }
}

help = (info) => {
    info.message.channel.send(
        new Discord.RichEmbed()
        .setTitle(`${config.prefix}help - This help menu!`)
        .addField(`General`, `**${config.prefix}start** - Create a new character and start playing\n**${config.prefix}character | ${config.prefix}c** - Display your character details\n${config.prefix}inventory | ${config.prefix}i - Display your inventory (COMING SOON)\n*{config.prefix}cooldowns | ${config.prefix}cd - Display your current activity cooldowns (COMING SOON)`)
        .addField(`Dungeon`, `**${config.prefix}dungeon @player1 @player2 @player3** - Enter the dungeon with up to 3 friends\n${config.prefix}dungeonDetails - Get details about today's daily dungeon (COMING SOON)`)
        .addField(`Idle Activities`, `**${config.prefix}adventure [level] | ${config.prefix}a [level]** - Send your character out on an idle adventure to gain experience and loot\n**${config.prefix}bounty | ${config.prefix}b** - Accept a bounty to hunt a rogue player`)
    )
}

adminHelp = (info) => {
	if (info.admin) {
        info.message.channel.send(
            new Discord.RichEmbed()
            .setTitle('Admin Help Menu')
            .addField(`Manage Players`, `**${config.prefix}giveexp [amount @player]** - Give X amount of exp to the player's active Job\n**${config.prefix}giveitem [@player]** - Give a random item to player`)
        )
    } else {
        info.message.channel.send("Nice try.");
    }
}