'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'currency', {
      type: Sequelize.ENUM,
      values: ['united_states_dollar', 'saudi_riyal'],
      defaultValue: 'united_states_dollar',
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'currency');
  },
};
