module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TaskStatus',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    cancelledDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });

  Task.associate = function(models) {
    Task.belongsTo(models.TaskStatus, {
      foreignKey: 'statusId',
      as: 'taskStatus'
    });
    Task.hasMany(models.TaskRevision, {
      foreignKey: 'taskId',
      as: 'taskRevision'
    });
  };

  return Task;
};
