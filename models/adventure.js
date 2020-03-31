module.exports = (sequelize, DataTypes) => {
	const Adventure = sequelize.define('Adventure', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
            primaryKey: true,
			autoIncrement: true
        },
		title: {
			type: DataTypes.STRING,
			allowNull: false
        },
		description: {
			type: DataTypes.STRING,
			allowNull: false,
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
		tableName: 'Adventure',
		timestamps: false
    });

	return Adventure;
};