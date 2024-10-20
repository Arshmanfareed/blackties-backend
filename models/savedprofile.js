'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavedProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SavedProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      SavedProfile.belongsTo(models.User, {
        foreignKey: 'savedUserId',
        as: 'savedUser'
      });
    }
  }
  SavedProfile.init({
    userId: DataTypes.INTEGER,
    savedUserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SavedProfile',
  });
  return SavedProfile;
};