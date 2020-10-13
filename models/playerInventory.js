module.exports = (sequelize, DataTypes) => {
	const PlayerInventory = sequelize.define('PlayerInventory', {
		equipped: {
			type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
		}
	}, {
		tableName: 'PlayerInventory',
		timestamps: false
    });

	return PlayerInventory;
};