const jwt = require('jsonwebtoken')
const responseFunctions = require('../utils/responses')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) {
    return responseFunctions._401(res, 'Unauthorized')
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    return responseFunctions._401(res, 'Invalid code')
  }
}
