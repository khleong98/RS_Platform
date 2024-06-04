'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Task', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      completion: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      completionDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      cancelledDate: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.createTable('TaskRevision', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Task',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskRevision');
    await queryInterface.dropTable('Task');
  }
};
