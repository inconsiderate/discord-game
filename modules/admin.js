module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "giveexp", giveExp);
        bot.add_command(bot, "giveitem", giveRandomItem);
    }
}

// give X exp to player
function giveExp(info) {
    console.log(info.admin);
	if (info.admin) {

        if (!info.msg) {
            info.message.channel.send(`Please use **${config.prefix}giveexp <@player>** for this command`); return;
        }

		try{
			eval(info.msg);
		} catch (e) {
			console.log(e);
		}
	}
}


// give X item to player as if they looted it
function giveRandomItem(info) {
	if (info.admin) {

        if (!info.msg) {
            info.message.channel.send(`Please use **${config.prefix}giveitem <rank>** for this command`); return;
        }
        
		try{
			eval(info.msg);
		} catch (e) {
			console.log(e);
		}
	}
}