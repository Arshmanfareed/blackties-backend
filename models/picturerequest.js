'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PictureRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PictureRequest.belongsTo(models.User, {
        as: 'pictureRequesterUser',
        foreignKey: 'requesterUserId'
      })

      PictureRequest.belongsTo(models.User, {
        as: "pictureRequesteeUser",
        foreignKey: 'requesteeUserId'
      })
    }
  }
  PictureRequest.init({
    requesterUserId: DataTypes.INTEGER,
    requesteeUserId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    isViewed: DataTypes.BOOLEAN,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PictureRequest',
  });
  return PictureRequest;
};