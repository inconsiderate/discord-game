// @param {array} reactions - array of emojis
exports.addMultipleReactions = (message, reactions) => {
    reactions.reduce(
        function reducer(promiseChain, value) {
            var nextLink = promiseChain.then(
                function() {
                    return(message.react(value))
                }
            );
            return(nextLink);
        },
        Promise.resolve(null)
    );
}


// @param {array} reactions - array of emojis
// @param {integer} expectedClicked - discord user id
//
exports.collectFirstReaction = (info, message, reactions, expectedClicker) => {
    console.log(user.id + ' ' + expectedClicker);
    return new Promise((resolve, reject) => {
        const filter = (reaction, info.message.author.id) => {

            console.log('inside filter: ' + user.id + ' ' + expectedClicker)
            // only accept this reaction if it is sent by expectedClicker
            return reactions.includes(reaction.emoji.name) && user.id === expectedClicker;
        };

        // wait 30 seconds for a reply
        message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            resolve(collected.first());
        })
        .catch(collected => {
            // return no reply
            resolve(false);
        });
    })
}