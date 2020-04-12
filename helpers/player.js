exports.gainExp = (player, exp) => {
    let playerJob = player.Jobs[0].PlayerJob;

    // add exp to this job
    playerJob.exp += exp;
    // is this enough exp to level up?
    if (playerJob.exp >= globals.expForNextLevel(playerJob.level + 1)) {
        playerJob.level += 1;
    } 

    playerJob.save()
}

exports.gainInventory = (player, itemName, type, power) => {
    console.log(player.Inventory);
}