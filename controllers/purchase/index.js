const purchaseService = require('../../services/purchase/purchase')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')

module.exports = {
  createStripePurchaseLink: async (req, res) => {
    const { body, headers, user } = req
    const { id: userId } = user
    const [err, data] = await to(purchaseService.createStripePurchaseLink(body, headers.host, userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  successfullStripePurchase: async (req, res) => {
    const { session_id } = req.query
    const [err, data] = await to(purchaseService.successfullStripePurchase(session_id))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return res.redirect(data)
  },
  cancelStripePurchase: async (req, res) => {
    const [err, data] = await to(purchaseService.cancelStripePurchase())
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return res.redirect(data)
  },
  buyPremiumMembership: async (req, res) => {
    const { body, headers, user } = req
    const { id: userId } = user
    const [err, data] = await to(purchaseService.buyPremiumMembership(body, headers.host, userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  purchaseIndividualFeature: async (req, res) => {
    const { user, params } = req
    const { id: userId } = user
    const { id: featureId } = params
    const [err, data] = await to(purchaseService.purchaseIndividualFeature(userId, featureId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Purchase successfully')
  },
  getListOfAvailableFeatures: async (req, res) => {
    const { gender } = req.query
    const [err, data] = await to(purchaseService.getListOfAvailableFeatures(gender))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getUserFeatures: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(purchaseService.getUserFeatures(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getSubscriptionPlans: async (req, res) => {
    const { gender } = req.query
    const [err, data] = await to(purchaseService.getSubscriptionPlans(gender))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
}
