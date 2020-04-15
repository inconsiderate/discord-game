module.exports = (sequelize, DataTypes) => {
	const PlayerInventory = sequelize.define('PlayerInventory', {
		equipped: {
			type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
		}
	}, {
		tableName: 'PlayerInventory',
		timestamps: false
    });

	return PlayerInventory;
};