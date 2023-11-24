const adminService = require('../../services/admin')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')
const { userValidations } = require('../../validations')

module.exports = {
  getUsers: async (req, res) => {
    const { query } = req
    const [err, data] = await to(adminService.getUsers(query))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  listAllUsers: async (req, res) => {
    const { body } = req
    const { limit, offset } = req.query
    const [err, data] = await to(adminService.listAllUsers(body, {limit: limit ? limit : 10, offset: offset ? offset : 0}))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  suspendUser: async (req, res) => {
    const { body, params } = req
    const { id: userId } = params
    const [err, data] = await to(adminService.suspendUser(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User suspended successfully')
  },
  unsuspendUser: async (req, res) => {
    const { id: userId } = req.params
    const [err, data] = await to(adminService.unsuspendUser(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User unsuspended successfully')
  },
  createSubAdmin: async (req, res) => {
    const { email } = req.body
    const [err, data] = await to(adminService.createSubAdmin(email))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Sub-admin created successfully')
  },
  lockDescription: async (req, res) => {
    const { body, params } = req
    const { id: userId } = params
    const [err, data] = await to(adminService.lockDescription(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Description locked successfully')
  },
  unlockDescription: async (req, res) => {
    const { params } = req
    const { id: userId } = params
    const [err, data] = await to(adminService.unlockDescription(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Description unlocked successfully')
  },
  deleteDescription: async (req, res) => {
    const { id: userId } = req.params
    const [err, data] = await to(adminService.deleteDescription(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Description deleted successfully')
  },
  addCreditInUserWallet: async (req, res) => {
    const { id: userId } = req.params
    const { amount } = req.body
    if (!amount || amount <= 0) {
      return responseFunctions._400(res, 'Amount must greater than 0')
    }
    const [err, data] = await to(adminService.addCreditInUserWallet(userId, amount))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Credit added successfully')
  },
  editUsername: async (req, res) => {
    const { id: userId } = req.params
    const { body } = req
    const { error } = userValidations.validateUpdateUsername(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(adminService.editUsername(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User updated successfully')
  },
  getUserDetails: async (req, res) => {
    const { id: userId } = req.params
    const [err, data] = await to(adminService.getUserDetails(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getCounters: async (req, res) => {
    const { query } = req
    const [err, data] = await to(adminService.getCounters(query))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
}
