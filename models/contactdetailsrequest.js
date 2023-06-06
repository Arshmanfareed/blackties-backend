'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactDetailsRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ContactDetailsRequest.belongsTo(models.User, {
        as: 'requesterUser',
        foreignKey: 'requesterUserId'
      })

      ContactDetailsRequest.belongsTo(models.User, {
        as: "requesteeUser",
        foreignKey: 'requesteeUserId'
      })
    }
  }
  ContactDetailsRequest.init({
    requesterUserId: DataTypes.INTEGER,
    requesteeUserId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    message: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ContactDetailsRequest',
  });
  return ContactDetailsRequest;
};