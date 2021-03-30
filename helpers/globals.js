
var itemTypes = {
    '🗡️': 'Sword',
    '🔫': 'Gun',
    '🦯': 'Staff'
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
    'with Sparkly Bits On Top',
    'of Hardening'
]

exports.expForNextLevel = (nextLevel) => {
    return expPerLevel[nextLevel];
}

exports.createRandomWeapon = _ => {
    return new Promise((resolve, reject) => {
        let item = {name: '', type: 1, power: 1};
        if (Math.random() < 0.7) {
            let prefix = itemPrefixAdjectives[Math.floor(Math.random() * itemPrefixAdjectives.length)];
            item.name = prefix;
        }
        item.name += ' Sword';
        if (Math.random() < 0.7) {
            let suffix = itemSufffixAdjectives[Math.floor(Math.random() * itemSufffixAdjectives.length)];
            item.name += ` ${suffix}`;
        }
        
        console.log('creating new sword');
        db.Inventory.create(item)
        .then((newItem) => {
            console.log("New SWORD created: ", newItem.id);  
            resolve(newItem);
        })
    })
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