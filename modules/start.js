module.exports = {
    declare : function(bot) {
        bot.add_command(bot, "start", start);
    }
}

start = (info) => {
    db.Player.findOne({where: {id: info.message.author.id}}).then(function (player) {
        if (!player) {

            // fetch all available Job options
            db.Job.findAll({attributes: ['name', 'emoji']}, {raw: true}).then(function (jobs) {
                jobIcons = [], jobText = '';

                for (job in jobs) {
                    // craft jobs message and emoji array
                    jobIcons.push(jobs[job].emoji);
                    jobText += jobs[job].emoji + ' - ' + jobs[job].name + '\n';
                }

                // character creation message
                info.message.channel.send(new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle(`Create New Character ${info.message.author.tag}`)
                .addField("Select your starting Job\n", jobText))
                .then( message => {
                    // add all Job icons as reactions
                    helper.addMultipleReactions(message, jobIcons)
                    helper.collectFirstReaction(info, message, jobIcons).then((jobReaction) => {

                        db.Job.findOne({where: {emoji: jobReaction.emoji.name}, include: [db.Ability] })
                        .then(function (selectedJob) {
                            abilityIcons = [], abilityText = '';
                            for (ability in selectedJob.Abilities) {

                                // craft abilities message and emoji array
                                abilityIcons.push(selectedJob.Abilities[ability].emoji);
                                abilityText += selectedJob.Abilities[ability].emoji + ' ' + selectedJob.Abilities[ability].name + ' - ' + selectedJob.Abilities[ability].description + '\n';
                            }

                            message.delete();

                            info.message.channel.send(new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle('Create New Character')
                            .addField("Select a starting Utility Ability for your Job", abilityText))
                            .then( message => {
                                helper.addMultipleReactions(message, abilityIcons)
                                helper.collectFirstReaction(info, message, abilityIcons).then((abilityReaction) => {

                                    // create new player with selected job
                                    createNewPlayer(info, selectedJob, abilityReaction)
                                    .then( (newPlayer) => {
                                        
                                    }); return;
                                })
                            })
                        })
                    })
                })
            })
        } else {
            info.message.channel.send("You have already made a character! (try the help command)"); return;
        }
    });
}

createNewPlayer = (info, job, ability) => {
    db.Ability.findOne({where: {emoji: ability.emoji.name}})
    .then(function (selectedAbility) {

        // create new player with Job and Ability
        console.log('saving player: ' + info.message.author.id);
        db.Player.create({ id: info.message.author.id})
        .then((newPlayer) => {
            newPlayer.addAbility(1);
            newPlayer.addAbility(selectedAbility);
            newPlayer.addJob(job);
            console.log("New player created: ", newPlayer.id);
            
            
            info.message.channel.send(`${info.message.author.tag} is a Level 1 ${job.emoji}${job.name}! Good luck out there! (type &help to get started)`);
        })
    })
}
