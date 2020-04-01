module.exports = (sequelize, DataTypes) => {
	const Job = sequelize.define('Job', {
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
        emoji: {
			type: DataTypes.STRING,
			allowNull: false
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
		tableName: 'Job',
		timestamps: false
	});

    Job.associate = function(models) {
        Job.hasMany(models.Ability, {foreignKey: 'jobId'})
	};
	
	return Job;
};