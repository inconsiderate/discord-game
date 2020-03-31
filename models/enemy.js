module.exports = (sequelize, DataTypes) => {
	const Enemy = sequelize.define('Enemy', {
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
		health: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 50,
        },
        attack: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 5,
        },
        defense: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 5,
        },
        speed: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 1,
        },
        entranceText: {
			type: DataTypes.STRING,
			allowNull: true,
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
		tableName: 'Enemy',
		timestamps: false
    });

	return Enemy;
};