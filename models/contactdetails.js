'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ContactDetails.belongsTo(models.ContactDetailsRequest, {
        foreignKey: 'contactDetailsRequestId'
      })
    }
  }
  ContactDetails.init({
    contactDetailsRequestId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    personToContact: DataTypes.STRING,
    nameOfContact: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    message: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ContactDetails',
  });
  return ContactDetails;
};