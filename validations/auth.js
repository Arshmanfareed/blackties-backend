const Joi = require('joi')

module.exports = {
  validateVerifyCode: function (obj) {
    const schema = Joi.object({
      email: Joi.string().email().required().label('Email').messages({
        'any.required': `{#label} is Required`,
      }),
      code: Joi.number().required().label('Code').messages({
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
  validateSocialSignup: function (obj) {
    const schema = Joi.object({
      username: Joi.string().required().label('Username').messages({
        'any.required': `{#label} is Required`,
      }),
      email: Joi.string().required().label('Email').messages({
        'any.required': `{#label} is Required`,
      }),
      platform: Joi.string().required().valid('google', 'facebook', 'apple').label('Platform').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
}
