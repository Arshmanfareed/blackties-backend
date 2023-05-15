const userService = require('../../services/user/user')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')

module.exports = {
  requestContactDetails: async (req, res) => {
    const { id: requesteeUserId } = req.params
    const { id: requesterUserId } = req.user
    const [err, data] = await to(userService.requestContactDetails(requesterUserId, requesteeUserId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request sent successfully')
  },
}
