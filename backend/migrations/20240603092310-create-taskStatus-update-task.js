'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('TaskStatus', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.addColumn('Task', 'statusId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TaskStatus',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.removeColumn('Task', 'completion');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Task', 'completion', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.removeColumn('Task', 'statusId');
    await queryInterface.dropTable('TaskStatus');
  }
};
