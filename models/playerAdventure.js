module.exports = (sequelize, DataTypes) => {
	const PlayerAdventure = sequelize.define('PlayerAdventure', {
		expiry: {
			type: DataTypes.DATE,
			allowNull: false
		},
		rank: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		rareChance: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		expReward: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		goldReward: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: 'PlayerAdventure',
		timestamps: false
    });

	return PlayerAdventure;
};