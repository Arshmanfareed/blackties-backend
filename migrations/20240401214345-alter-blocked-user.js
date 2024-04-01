'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add your alterations here
    await queryInterface.addColumn('blockedusers', 'blockerUserIpAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the alterations here
    await queryInterface.removeColumn('blockedusers', 'blockerUserIpAddress');
  }
};
