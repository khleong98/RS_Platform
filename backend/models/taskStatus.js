module.exports = (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('TaskStatus', {
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });

  TaskStatus.associate = function(models) {
    TaskStatus.hasMany(models.Task, {
      foreignKey: 'statusId',
      as: 'task'
    });
  };

  return TaskStatus;
};