const { interactionResources } = require('../config/constants')

module.exports = (data) => {
  data = data.map((instance) => {
    instance = JSON.parse(JSON.stringify(instance))
    if (instance.resourceType === interactionResources.USER_MEDIA && instance.UserMedia !== null) {
      instance.resource = instance.UserMedia;
    } else if (instance.resourceType === interactionResources.PROFILE_PROMPT && instance.ProfilePrompt !== null) {
      instance.resource = instance.ProfilePrompt;
    }
    // delete to prevent duplicates
    delete instance.UserMedia;
    delete instance.ProfilePrompt;
    return instance
  })
  return data
}