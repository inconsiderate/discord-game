
// how much exp is required to gain each level
var expPerLevel = {
    2: 100,
    3: 500,
    4: 1500,
    5: 3000,
    6: 7500,
    7: 18000,
    8: 40000,
    9: 100000,
    10: 200000
}

var itemPrefixAdjectives = [
    'Glistening',
    'Radiant',
    'Sparkling',
    'Demonic',
    'Throbbing',
    'Miniscule',
    'Vivacious',
    'Deafening',
    'Beautiful'
]
var itemSufffixAdjectives = [
    'of the Eldest Gods',
    '+1',
]

exports.expForNextLevel = (nextLevel) => {
    return expPerLevel[nextLevel];
}

exports.createRandomWeapon = _ => {
    let itemName = '';
    if (Math.random() < 0.7) {
        let prefix = itemPrefixAdjectives[Math.floor(Math.random() * itemPrefixAdjectives.length)];
        itemName = prefix;
    }
    itemName += ' Sword';
    if (Math.random() < 0.7) {
        let suffix = itemSufffixAdjectives[Math.floor(Math.random() * itemSufffixAdjectives.length)];
        itemName += ` ${suffix}`;
    }
        
    return itemName;
}

exports.createRandomArmor = _ => {
    let itemName = '';
    if (Math.random() < 0.7) {
        let prefix = itemPrefixAdjectives[Math.floor(Math.random() * itemPrefixAdjectives.length)];
        itemName = prefix;
    }
    itemName += ' Armor';
    if (Math.random() < 0.7) {
        let suffix = itemSufffixAdjectives[Math.floor(Math.random() * itemSufffixAdjectives.length)];
        itemName += ` ${suffix}`;
    }
        
    return itemName;
}