const Joi = require('joi')
const { gender } = require('../config/constants')

module.exports = {
  validateVerifyCode: function (obj) {
    const schema = Joi.object({
      userId: Joi.number().required().label('userId').messages({
        'any.required': `{#label} is Required`,
        'string.email': 'Enter a valid email',
      }),
      phoneNo: Joi.string().required().label('Phone No').messages({
        'any.required': `{#label} is Required`,
      }),
      code: Joi.string().required().label('Code').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validatesignUpOrSignInByEmail: function (obj) {
    const schema = Joi.object({
      email: Joi.string().email().required().label('Email').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateLogin: function (obj) {
    const schema = Joi.object({
      email: Joi.string().email().required().label('Email').messages({
        'any.required': `{#label} is Required`,
        'string.email': 'Enter a valid email',
      }),
      password: Joi.string().required().label('Password').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateCreateProfile: function (obj) {
    const schema = Joi.object({
      sex: Joi.string().required().label('Sex').valid(gender.MALE, gender.FEMALE).messages({
        'any.required': `{#label} is Required`,
      }),
      dateOfBirth: Joi.string().required().label('Date Of Birth').messages({
        'any.required': `{#label} is Required`,
      }),
      height: Joi.number().required().min(130).max(210).label('Height').messages({
        'any.required': `{#label} is Required`,
        'number.min': `{#label} must be at least 130`,
        'number.max': `{#label} cannot exceed 210`,
        'number.base': `{#label} is not valid`,
      }),
      weight: Joi.number().required().min(30).max(200).label('Weight').messages({
        'any.required': `{#label} is Required`,
        'number.min': `{#label} must be at least 30`,
        'number.max': `{#label} cannot exceed 200`,
        'number.base': `{#label} is not valid`,
      }),
      country: Joi.string().required().label('Country').messages({
        'any.required': `{#label} is Required`,
      }),
      city: Joi.string().required().label('City').messages({
        'any.required': `{#label} is Required`,
      }),
      nationality: Joi.string().required().label('Nationality').messages({
        'any.required': `{#label} is Required`,
      }),
      religiosity: Joi.string().required().label('Religiosity').messages({
        'any.required': `{#label} is Required`,
      }),
      education: Joi.string().required().label('Education').messages({
        'any.required': `{#label} is Required`,
      }),
      skinColor: Joi.string().required().label('Skin Color').messages({
        'any.required': `{#label} is Required`,
      }),
      ethnicity: Joi.string().required().label('Ethnicity').messages({
        'any.required': `{#label} is Required`,
      }),
      maritalStatus: Joi.string().required().label('Marital Status').messages({
        'any.required': `{#label} is Required`,
      }),
      tribe: Joi.string().required().allow(null).label('Tribe').messages({
        'any.required': `{#label} is Required`,
      }),
      username: Joi.string().required().min(4).max(16).label('Username').messages({
        'any.required': `{#label} is Required`,
        'string.min': `{#label} must be at least 4 characters long`,
        'string.max': `{#label} cannot exceed 16 characters`,
      }),
      email: Joi.string().required().label('Email').messages({
        'any.required': `{#label} is Required`,
        'string.email': 'Enter a valid email',
      }),
      password: Joi.string().min(8).max(15).required().label('Password').messages({
        'any.required': `{#label} is Required`,
        'string.min': `{#label} must be at least 8 characters long`,
        'string.max': `{#label} cannot exceed 15 characters`,
      }),
      language: Joi.string().required().valid('en', 'ar').label('Language').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateSocialSignup: function (obj) {
    const schema = Joi.object({
      username: Joi.string().required().label('Username').messages({
        'any.required': `{#label} is Required`,
      }),
      email: Joi.string().required().label('Email').messages({
        'any.required': `{#label} is Required`,
      }),
      platform: Joi.string()
        .required()
        .valid('google', 'facebook', 'apple')
        .label('Platform')
        .messages({
          'any.required': `{#label} is Required`,
        }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateResetPassword: function (obj) {
    const schema = Joi.object({
      email: Joi.string().email().required().label('Email').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateChangePassword: function (obj) {
    const schema = Joi.object({
      oldPassword: Joi.string().min(1).max(50).allow(null, 'null', '').label('Old Password').messages({
        'any.required': `{#label} is Required`,
      }),
      password: Joi.string().min(8).max(50).required().label('Password').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateDeactivateAccount: function (obj) {
    const schema = Joi.object({
      reason: Joi.string().label('Reason').required().messages({
        'any.required': `Please select {#label}`,
        'string.empty': `Please select {#label}`,
      }),
      feedback: Joi.string().allow(null).required().label('Feedback').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
}

