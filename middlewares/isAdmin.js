const responseFunctions = require("../utils/responses");
const { roles } = require("../config/constants");

module.exports = function (req, res, next) {
  const { role } = req.user;
  if (role === roles.USER) return responseFunctions._403(res, 'Forbidden!! You don"t have permissions to access this route.')
  next()
}