module.exports = (sequelize, DataTypes) => {
  const TaskRevision = sequelize.define('TaskRevision', {
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Task',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });

  TaskRevision.associate = function(models) {
    TaskRevision.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task'
    });
  };

  return TaskRevision;
};
