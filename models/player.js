module.exports = (sequelize, DataTypes) => {
	const Player = sequelize.define('Player', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
            primaryKey: true
        },
		max_health: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 10,
        },
		current_health: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 10,
        },
        attack: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 1,
        },
        defense: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 1,
        },
        speed: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 1,
        },
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	}, {
		tableName: 'Player',
		timestamps: false
    });

    Player.associate = function(models) {
        Player.belongsToMany(models.Ability, {through: 'PlayerAbility'})
        Player.belongsToMany(models.Job, {through: 'PlayerJob'})
        Player.belongsToMany(models.Adventure, {through: 'PlayerAdventure'})
    };

	return Player;
};