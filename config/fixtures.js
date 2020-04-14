exports.execute = () => {
    createJobs();
    createAdmins();
    createEnemies();
    createAdventures();
    createAbilities()
    // createFakePlayers();
}

const createAdmins = () => {
    db.Admin.findAll().then(function (admins) {
        if (!admins.length) {
            console.log('No admins found. Creating admins...')
            db.Admin.bulkCreate([
                {id: '146365826939748353'} // incon
            ])
            .then((newAdmins) => {console.log('New admins created.')})
            .catch((err) => {console.log("Admin creation error : ", err)})
        }
    })
}

const createFakePlayers = () => {
    db.Job.findOne({where: {id: 1} })
    .then(selectedJob => {
        console.log('found a job: ' + selectedJob.name)
        db.Ability.findOne({where: {id: 2}})
        .then(selectedAbility => {
            console.log('found an ability: ' + selectedAbility.name)
            // create new player with Job and Ability
            db.Player.create({ id: 146365826939748353})
            .then(newPlayer => {
                newPlayer.addAbility(1);
                newPlayer.addAbility(selectedAbility);
                newPlayer.addJob(selectedJob);
                console.log("NEW PLAYER CREATED: ", newPlayer.id);
            })
        })
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
                    combatLogText: "slaps the",
                    damageType: 1,
                    emoji: '👋',
                    rank: 1
                },
                // wizard
                {name: 'Smoke Screen',
                    description: 'Conjure a wall of smoke to hinder enemy attacks',
                    combatLogText: "conjures a wall of smoke to obscure the vision of the",
                    emoji: '🌫️',
                    rank: 1,
                    jobId: 1
                },
                {name: 'Smoke Screen',
                    description: 'Conjure a wall of smoke to hinder enemy attacks',
                    combatLogText: "conjures a wall of smoke to obscure the vision of the",
                    emoji: '🌫️',
                    rank: 1,
                    jobId: 1
                },
                // gunslinger
                {name: 'Overcharge',
                    description: "Overcharge your weapon's energy cells for extra power",
                    combatLogText: "routes extra power into their weapon!",
                    emoji: '🔫',
                    rank: 1,
                    jobId: 2
                },
                {name: 'Overcharge',
                    description: "Overcharge your weapon's energy cells for extra power",
                    combatLogText: "routes extra power into their weapon!",
                    emoji: '🔫',
                    rank: 1,
                    jobId: 2
                },
                // shapeshifter
                {name: 'Turtle Shell',
                    description: 'Shift your back into a turtle shell for extra protection',
                    combatLogText: "shifts into a turtle form, gaining extra protection",
                    emoji: '🐢',
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
                    combatLogText: "attempts to steal from the",
                    emoji: '🕵️',
                    rank: 1,
                    jobId: 5
                },
                {name: 'Steal',
                    description: 'Plunder money or goods from the enemy',
                    combatLogText: "attempts to steal from the",
                    emoji: '🕵️',
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
                    title: 'The Golden Goblin',
                    description: "Kill the Golden Goblin and bring his head to the village barkeep. Why does it want it? You don't want to know."
                },
                {
                    title: 'Lost Cupcake Recipe',
                    description: "Scour the depths of the Ruinous Dungeon to recover Sara's the lost cupcake recipe."
                },
                {
                    title: 'The Stolen Crown',
                    description: 'Hunt down a bounty hunter who stole the kings head and crown and seek revenge for the prince.'
                },
                {
                    title: 'Translate an Ancient Scroll',
                    description: 'Find the ancient tribe and translate an ancient scroll to stop the doomsday event.'
                },
                {
                    title: 'Bird Egg Quest', description: 'Find the lost bird egg and bring it back to the nest.'
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