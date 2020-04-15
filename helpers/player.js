exports.gainExp = (player, exp) => {
    let playerJob = player.Jobs[0].PlayerJob;

    // add exp to this job
    playerJob.exp += exp;
    // is this enough exp to level up?
    if (playerJob.exp >= globals.expPerLevel[playerJob.level + 1]) {
        playerJob.level += 1;
    } 

    playerJob.save()
}

exports.gainMonies = (player, monies) => {
    player.monies += monies;
    player.save()
}

exports.gainInventory = (player, itemName, type, power) => {
    console.log(player.Inventory);
}