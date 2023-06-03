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
  validateRespondToRequestContactDetails: function (obj) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).label('name').required().messages({
        'any.required': `{#label} is Required`,
      }),
      personToContact: Joi.string().min(3).max(30).label('Person To Contact').required().messages({
        'any.required': `{#label} is Required`,
      }),
      nameOfContact: Joi.string().min(3).max(30).label('Name Of Contact').required().messages({
        'any.required': `{#label} is Required`,
      }),
      phoneNo: Joi.string().min(3).max(30).label('phoneNo').required().messages({
        'any.required': `{#label} is Required`,
      }),
      status: Joi.string().label('status').valid(requestStatus.ACCEPTED, requestStatus.REJECTED).required().messages({
        'any.required': `{#label} is Required`,
      }),
      message: Joi.string().min(3).max(100).label('message').required().messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
}

