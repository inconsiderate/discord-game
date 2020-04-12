module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "help", help);
        bot.add_command(bot, "h", help);
    }
}

help = (info) => {
    info.message.channel.send(
        new Discord.RichEmbed()
        .setTitle('Help Menu')
        .addField(`General`, `**start** - Create a new character and start playing\n**character / c** - Display your character details\n**inventory / i** - Display your inventory (COMING SOON)`)
        .addField(`Dungeon`, `**dungeon @player1 @player2 @player3** - Enter the dungeon with up to 3 friends\n**dungeonDetails** - Get details about today's dungeon`)
        .addField(`Adventure`, `**adventure [level] / a [level]** - Send your character out on an idle adventure to gain experience and loot`)
    )
}