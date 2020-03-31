module.exports = (sequelize, DataTypes) => {
	const PlayerAdventure = sequelize.define('PlayerAdventure', {
		expiry: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'PlayerAdventure',
		timestamps: false
    });

	return PlayerAdventure;
};