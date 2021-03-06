module.exports = (sequelize, DataTypes) => {
	const Inventory = sequelize.define('Inventory', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
            primaryKey: true,
			autoIncrement: true
        },
		name: {
			type: DataTypes.STRING,
			allowNull: false
        },
		type: {
			type: DataTypes.INTEGER,
			allowNull: false,
        },
		power: {
			type: DataTypes.INTEGER,
			allowNull: false,
        },
		value: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
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
		tableName: 'Inventory',
		timestamps: false
    });

	return Inventory;
};