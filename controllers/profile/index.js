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
  getMyProfile: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(profileService.getUserProfile(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  updateProfile: async (req, res) => {
    const { id: userId } = req.user
    const { body } = req
    const [err, data] = await to(profileService.updateProfile(body, userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Profile updated successfully')
  },
  saveOrUnsaveProfile: async (req, res) => {
    const { id: savedUserId } = req.params
    const { id: userId } = req.user
    const [err, data] = await to(profileService.saveOrUnsaveProfile(userId, savedUserId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, data ? 'Profile saved successfully' : 'Profile unsaved successfully')
  },
  getMySavedProfiles: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(profileService.getMySavedProfiles(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getUsersWhoSavedMyProfile: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(profileService.getUsersWhoSavedMyProfile(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getMyMatchesProfiles: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(profileService.getMyMatchesProfiles(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
}
