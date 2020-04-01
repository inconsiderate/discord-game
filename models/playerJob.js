module.exports = (sequelize, DataTypes) => {
	const PlayerJob = sequelize.define('PlayerJob', {
		level: {
			type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
		},
		exp: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 0
        },
	}, {
		tableName: 'PlayerJob',
		timestamps: false
    });

	return PlayerJob;
};