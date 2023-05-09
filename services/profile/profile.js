const db = require('../../models')
const constants = require('../../config/constants')
const { Op, where, Sequelize } = require('sequelize')

module.exports = {
  listAllProfiles: async (body) => {
    const today = new Date();
    const { gender, sortBy, sortOrder, age, nationality, country, city, height, weight, ethnicity, healthStatus, language, skinColor, religiosity, tribialAffiliation, education, financialStatus, maritalStatus } = body
    const whereFilterProfile = {
      height: { [Op.between]: [height[0], height[1]] },
      weight: { [Op.between]: [weight[0], weight[1]] },
      ...(nationality.length > 0 ? { nationality } : {}),
      ...(country.length > 0 ? { country } : {}),
      ...(city.length > 0 ? { city } : {}),
      ...(ethnicity.length > 0 ? { ethnicity } : {}),
      ...(healthStatus.length > 0 ? { healthStatus } : {}),
      ...(skinColor.length > 0 ? { skinColor } : {}),
      ...(religiosity.length > 0 ? { religiosity } : {}),
      ...(education.length > 0 ? { education } : {}),
      ...(financialStatus.length > 0 ? { financialStatus } : {}),
      ...(maritalStatus.length > 0 ? { maritalStatus } : {}),
    }
    if (Object.values(constants.gender).includes(gender)) {
      whereFilterProfile['sex'] = gender
    }
    return db.User.findAll({
      attributes: [
        'id',
        'email',
        'username',
        'status',
        'createdAt',
        [Sequelize.literal(`TIMESTAMPDIFF(YEAR, dateOfBirth, '${today.toISOString()}')`), 'age']
      ],
      include: [
        {
          model: db.Profile,
          where: whereFilterProfile,
        },
        {
          model: db.UserLanguage,
          ...(language.length > 0 ? { where: { language } } : {}),
        },
      ],
      having: {
        'age': {
          [Op.gte]: age[0],
          [Op.lte]: age[1]
        }
      },
      order: [
        [sortBy, sortOrder]
      ]
    })
  },
  getUserProfile: async (userId) => {
    return db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.Profile
        },
        {
          model: db.UserLanguage
        }
      ]
    })
  }
}
