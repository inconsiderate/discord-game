module.exports = (sequelize, DataTypes) => {
	const Ability = sequelize.define('Ability', {
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
		description: {
			type: DataTypes.STRING,
			allowNull: false
        },
		combatLogText: {
			type: DataTypes.STRING,
			allowNull: false
        },
        emoji: {
			type: DataTypes.STRING,
			allowNull: false
		},
		cooldown: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		rank: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		damageType: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jobId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'Job',
				key: 'id'
			}
		},
		// statusId: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		// 	references: {
		// 		model: 'Status',
		// 		key: 'id'
		// 	}
		// },
		statusChance: {
			type: DataTypes.INTEGER,
			allowNull: true
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
		tableName: 'Ability',
		timestamps: false
    });

	return Ability;
};