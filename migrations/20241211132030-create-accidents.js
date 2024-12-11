const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('accidents', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_applications', // Refers to user_applications table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      date_of_accident: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fault_status: {
        type: DataTypes.ENUM('Fault', 'Non-Fault', 'Pending'),
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('accidents');
  },
};
