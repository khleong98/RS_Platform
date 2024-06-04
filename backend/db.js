// Import Sequelize and your models
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './rs_platform_dev.sqlite'
});

const Task = require('./models/task')(sequelize, DataTypes);
const TaskRevision = require('./models/taskRevision')(sequelize, DataTypes);
const TaskStatus = require('./models/taskStatus')(sequelize, DataTypes);

// Define associations between models
Task.belongsTo(TaskStatus, { foreignKey: 'statusId' });
Task.hasMany(TaskRevision, { foreignKey: 'taskId' });
TaskRevision.belongsTo(Task, { foreignKey: 'taskId' });
TaskStatus.hasMany(Task, { foreignKey: 'statusId' });

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(error => {
    console.error('Error synchronizing database:', error);
  });

module.exports = {
  sequelize,
  Task,
  TaskRevision,
  TaskStatus
};
