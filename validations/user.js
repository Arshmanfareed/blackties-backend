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
      requesterName: Joi.string().min(3).max(30).allow(null, '', 'null').label('requesterName').required().messages({
        'any.required': `{#label} is Required`,
      }),
      requesterMessage: Joi.string().min(3).max(2000).allow(null, '', 'null').label('requesterMessage').required().messages({
        'any.required': `{#label} is Required`,
      }),
      name: Joi.string().min(3).max(30).label('name').allow(null, '', 'null').required().messages({
        'any.required': `{#label} is Required`,
      }),
      personToContact: Joi.string().min(3).max(30).allow(null, '', 'null').label('Person To Contact').required().messages({
        'any.required': `{#label} is Required`,
      }),
      nameOfContact: Joi.string().min(3).max(30).allow(null, '', 'null').label('Name Of Contact').required().messages({
        'any.required': `{#label} is Required`,
      }),
      phoneNo: Joi.string().min(3).max(30).allow(null, '', 'null').label('phoneNo').required().messages({
        'any.required': `{#label} is Required`,
      }),
      message: Joi.string().min(3).max(2000).allow(null, '', 'null').label('message').required().messages({
        'any.required': `{#label} is Required`,
      }),
      isFromFemale: Joi.boolean().label('isFromFemale').required().messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateRespondToRequestContactDetails: function (obj) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).label('name').allow(null, '', 'null').required().messages({
        'any.required': `{#label} is Required`,
      }),
      personToContact: Joi.string().min(3).max(30).allow(null, '', 'null').label('Person To Contact').required().messages({
        'any.required': `{#label} is Required`,
      }),
      nameOfContact: Joi.string().min(3).max(30).allow(null, '', 'null').label('Name Of Contact').required().messages({
        'any.required': `{#label} is Required`,
      }),
      phoneNo: Joi.string().min(3).max(30).allow(null, '', 'null').label('phoneNo').required().messages({
        'any.required': `{#label} is Required`,
      }),
      status: Joi.string().label('status').valid(requestStatus.ACCEPTED, requestStatus.REJECTED).required().messages({
        'any.required': `{#label} is Required`,
      }),
      message: Joi.string().min(3).max(100).allow(null, '', 'null').label('message').required().messages({
        'any.required': `{#label} is Required`,
      }),
      isFemaleResponding: Joi.boolean().label('isFromFemale').required().messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateUpdateNotification: function (obj) {
    const schema = Joi.object({
      id: Joi.array().required().items(Joi.number()).min(1).label('id').messages({
        'any.required': `{#label} is Required`,
      }),
      status: Joi.boolean().required().label('status').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateAnswerToQuestion: function (obj) {
    const schema = Joi.object({
      answer: Joi.string().min(3).max(2000).label('answer').required().messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateUpdateUser: function (obj) {
    const schema = Joi.object({
      email: Joi.string().email().label('Email').messages({
        'any.required': `{#label} is Required`,
      }),
      phoneNo: Joi.string().label('Phone No.').messages({
        'any.required': `{#label} is Required`,
      }),
      password: Joi.string().required().label('Password').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: false })
  },
  validateUpdateUsername: function (obj) {
    const schema = Joi.object({
      username: Joi.string().required().min(4).max(16).label('Username').messages({
        'any.required': `{#label} is Required`,
        'string.min': `{#label} must be at least 4 characters long`,
        'string.max': `{#label} cannot exceed 16 characters`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateGetFileFromS3: function (obj) {
    const schema = Joi.object({
      filename: Joi.string().required().valid('en.json', 'ar.json').label('filename').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
}

