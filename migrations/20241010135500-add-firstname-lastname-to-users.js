'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

      await queryInterface.addColumn('Users', 'firstname', {
        type: Sequelize.STRING,
        allowNull: false, // Or true if null is allowed
      });
      await queryInterface.addColumn('Users', 'lastname', {
        type: Sequelize.STRING,
        allowNull: false, // Or true if null is allowed
      });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('Users', 'firstname');
    await queryInterface.removeColumn('Users', 'lastname');
  }
};
