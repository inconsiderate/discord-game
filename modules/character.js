module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "character", character);
        bot.add_command(bot, "c", character);
        bot.add_command(bot, "equip", equip);
        bot.add_command(bot, "sell", sell);
    }
}

character = (info) => {
    db.Player.findOne({where: {id: info.message.author.id}, include: [db.Ability, db.Job, db.Inventory] }).then((player) => {

        if (!player) {info.message.channel.send("You don't have a character. Use start to create one."); return;}
        let abilitiesList = '', inventoryList = '';

        // list all the player's current abilities
        for (ability in player.Abilities) {
            abilitiesList += `${player.Abilities[ability].emoji} ${player.Abilities[ability].name} - ${player.Abilities[ability].description}\n`;
        }

        // list all inventory items
        player.Inventories.forEach(item => {
            if (item.PlayerInventory.equipped) inventoryList += `✔️ `
            inventoryList += `${item.id}) ${item.name} (Power ${item.power})\n`;
        });

        info.message.channel.send(
            new Discord.RichEmbed()
            .addField(`${info.message.author.tag}`, `Level ${player.Jobs[0].PlayerJob.level} ${player.Jobs[0].name}`, true)
            .addField(`Next Level`, `${player.Jobs[0].PlayerJob.exp}/${globals.expPerLevel[player.Jobs[0].PlayerJob.level + 1]} xp`, true)
            .addField('Stats',`Health: ${player.max_health}\nPower: ${player.attack}\nDefense: ${player.defense}`, true)
            .addField('Dungeon Abilities', `${abilitiesList}`, true)
            .addField("Inventory", `${player.monies} monies\n` + inventoryList)
        )
    })
}

equip = (info) => {
    console.log('trying to EQUIP something')
    db.Player.findOne({where: {id: info.message.author.id}, include: [db.Inventory] }).then((player) => {
        if (!player) {info.message.channel.send(`You don't have a character. Use **${config.prefix}start** to create one.`); return;}
        if (!info.msg) {info.message.channel.send(`Please use **${config.prefix}equip <item_id>** for this command`); return;}

        let input = info.msg.replace(/<|!|>|@/g, "")
        inputVars = input.split(" ");

        player.Inventories.forEach(item => {
            console.log(item.id + ' ' + inputVars[0])

            if (inputVars[0] == item.id) {
                // item.updateAttributes({
                //     equipped: 1
                // })

                console.log('trying to equip item: ' + item.id)
                item.equipped = 1;
                item.save()

                info.message.channel.send(`${info.message.author.tag} equipped the ` + item.name);
            }            
        });

    })
}

sell = (info) => {
    let input = info.msg.replace(/<|!|>|@/g, "")
    inputVars = input.split(" ");

    db.Player.findOne({
        where: { id: info.message.author.id },
        include: [db.Inventory, {
            model: db.Inventory,
            where: { id: inputVars[0] }
        }] 
    }).then((player) => {
        if (!player) {info.message.channel.send("You don't have a character. Use start to create one."); return;}

        player.Inventories.forEach(item => {
            if (inputVars[0] == item.id) {
                console.log('trying to SELL item: ' + item.id + ` for ${item.value}`);
                player.monies += item.value;
                db.Inventory.destroy({where: {id:item.id} });
                player.save()

                info.message.channel.send(`${info.message.author.tag} sold the ` + item.name + ' for 1 monies');
            }            
        });

    })
}