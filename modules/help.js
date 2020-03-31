module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "help", help);
    }
}

help = (info) => {
    info.message.channel.send(
        new Discord.RichEmbed()
        .setTitle('Help Menu')
        .addField(`start`, `Create a new character and start playing`)
        .addField(`character`, `View your character details`)
        .addField(`dungeon`, `Enter the dungeon`)
    )
}