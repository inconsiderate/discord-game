module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "help", help);
    }
}

help = (info) => {
    info.message.channel.send(
        new Discord.RichEmbed()
        .setTitle('Help Menu')
        .addField(`General`, `**start** - Create a new character and start playing\n**character** - Display your character details\n**inventory** - Display your inventory (COMING SOON)`)
        .addField(`Dungeon`, `**dungeon @player1 @player2 @player3** - Enter the dungeon with up to 3 friends\n**dungeonDeets** - Get details about the current dungeon`)
        .addField(`Adventure`, `**adventure** - Send your character out on an adventure (COMING SOON)`)
    )
}