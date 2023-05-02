const profileService = require('../../services/profile/profile')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')

module.exports = {
  listAllProfiles: async (req, res) => {
    const { body } = req
    const [err, data] = await to(profileService.listAllProfiles(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
}
