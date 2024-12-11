const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Accident extends Model {
    static associate(models) {
      // Accident belongsTo UserApplication
      Accident.belongsTo(models.UserApplication, {
        foreignKey: 'user_application_id',
        as: 'userApplication',
      });
    }
  }

  Accident.init(
    {
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
    },
    {
      sequelize,
      modelName: 'Accident',
      tableName: 'accidents',
      underscored: true,
    }
  );

  return Accident;
};
