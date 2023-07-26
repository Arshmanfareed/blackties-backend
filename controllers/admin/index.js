const adminService = require('../../services/admin')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')

module.exports = {
  getActiveUsers: async (req, res) => {
    const { query } = req
    const [err, data] = await to(adminService.getActiveUsers(query))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
}
