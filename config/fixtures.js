exports.execute = () => {
    createJobs();
    createAdmins();
    // createPlayers();
    createEnemies();
    createAdventures();
    createAbilities();
}

const createAdmins = () => {
    db.Admin.findAll().then(function (admins) {
        if (!admins.length) {
            console.log('No admins found. Creating admins...')
            db.Admin.bulkCreate([
                {id: '146365826939748353'}, // incon
                {id: '642108520858386452'},
                {id: '107901991283339264'}
            ])
            .then((newAdmins) => {console.log('New admins created.')})
            .catch((err) => {console.log("Admin creation error : ", err)})
        }
    })
}

const createPlayers = () => {
    db.Player.findAll().then(function (players) {
        if (!players.length) {
            console.log('No players found. Creating players...')
            db.Player.bulkCreate([
                {id: '146365826939748353', JobId: 1, AbilityId: 1}, // incon
                {id: '642108520858386452', JobId: 2},
                {id: '107901991283339264', JobId: 3}
            ])
            .then((newPlayers) => {
                console.log('New players created.')
            })
            .catch((err) => {console.log("Player creation error : ", err)})
        }
    })
}

const createJobs = () => {
    db.Job.findAll().then(function (jobs) {
        if (!jobs.length) {
            console.log('No jobs found. Creating jobs...')
            db.Job.bulkCreate([
                {name: 'Oath Wizard', emoji: '✨'},
                {name: 'Gunslinger', emoji: '🤠'},
                {name: 'Shapeshifter', emoji: '👺'},
                {name: 'Brawler', emoji: '✊'},
                {name: 'Prowler', emoji: '🏹'}
            ])
            .then((newJobs) => {console.log('New jobs created.')})
            .catch((err) => {console.log("Job creation error : ", err)})
        }
    })
}

const createAbilities = () => {
    db.Ability.findAll().then(function (abilities) {
        if (!abilities.length) {
            console.log('No abilities found. Creating abilities...')
            db.Ability.bulkCreate([
                // default level 1 attack
                {name: 'Slap',
                    description: 'A hard slap across the face',
                    combatLogText: "slaps the enemy",
                    damageType: 1,
                    emoji: '👋',
                    rank: 1
                },
                // wizard
                {name: 'Smoke Screen',
                    description: 'Toss a ball of living flame at your enemy',
                    combatLogText: "conjures a ball of fire and throws it at the enemy",
                    emoji: '🔥',
                    rank: 1,
                    jobId: 1
                },
                // gunslinger
                {name: 'Triple Shot',
                    description: 'Fire your gun three times in quick succession',
                    combatLogText: "quickly fires three times at the enemy",
                    emoji: '🔫',
                    rank: 1,
                    jobId: 2
                },
                // shapeshifter
                {name: 'Pencil Jab',
                    description: 'Jab a pencil into an eye socket',
                    combatLogText: "jabs a pencil into the enemy's eye",
                    emoji: '✏️',
                    rank: 1,
                    jobId: 3
                },
                {name: 'Turtle Shell',
                    description: 'Shift your back into a turtle shell for extra protection',
                    combatLogText: "shifts into a turtle form, gaining extra protection",
                    emoji: '🐢',
                    rank: 1,
                    jobId: 3
                },
                // prowler
                {name: 'Steal',
                    description: 'Plunder money or goods from the enemy',
                    combatLogText: "attempts to steal from the enemy",
                    emoji: '🏹',
                    rank: 1,
                    jobId: 5
                }
            ])
            .then(() => {console.log('New abilities created.')})
            .catch((err) => {console.log("Ability creation error : ", err)})
        }
    })
}

const createAdventures = () => {
    db.Adventure.findAll().then(function (adventures) {
        if (!adventures.length) {
            console.log('No adventures found. Creating adventures...')
            db.Adventure.bulkCreate([
                {
                    title: 'Save the Werewolf King',
                    description: 'The werewolf king has been captured by the sociopathic Princess Jade! Rescue him and reap the rewards!'
                },
                {
                    title: 'Adventure 2',
                    description: 'Find the old man'
                },
                {
                    title: 'Adventure 3',
                    description: 'Rescue the cactus'
                }
            ])
            .then(() => {console.log('New adventures created.')})
            .catch((err) => {console.log("adventures creation error : ", err)})
        }
    })
}

const createEnemies = () => {
    db.Enemy.findAll().then(function (enemies) {
        if (!enemies.length) {
            console.log('No enemies found. Creating enemies...')
            db.Enemy.bulkCreate([
                {name: 'Space Marine', health: 15, difficulty: 1, entranceText: "A Space Marine approaches!"},
                {name: 'Blood Ogre', health: 20, difficulty: 1, entranceText: "A Blood Ogre approaches!"},
                {name: 'Dainty Lumberjack', health: 25, difficulty: 1, entranceText: "A Dainty Lumberjack approaches!"},
                {name: 'Living Chaos Orb', health: 5, difficulty: 1, entranceText: "A Living Chaos Orb approaches!"},
                {name: 'Shy Canadian', health: 30, difficulty: 2, entranceText: "A Shy Canadian approaches!"},
                {name: 'Towering Troll', health: 45, difficulty: 3, entranceText: "A Towering Troll approaches!"}
            ])
            .then(() => {console.log('New enemies created.')})
            .catch((err) => {console.log("Enemy creation error : ", err)})
        }
    })
}