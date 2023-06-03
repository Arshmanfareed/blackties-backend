const Joi = require('joi')
const { requestStatus } = require('../config/constants')

module.exports = {
  validateBlockUser: function (obj) {
    const schema = Joi.object({
      reason: Joi.array().required().items(Joi.string()).min(1).label('reason').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateUpdatePictureRequest: function (obj) {
    const schema = Joi.object({
      status: Joi.string().valid(requestStatus.ACCEPTED, requestStatus.REJECTED).label('status').messages({
        'any.required': `{#label} is Required`,
      }),
      isViewed: Joi.boolean().label('isViewed').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateRequestContactDetails: function (obj) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).label('name').required().messages({
        'any.required': `{#label} is Required`,
      }),
      message: Joi.string().min(3).max(100).label('message').required().messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
}

