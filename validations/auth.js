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
  validateLogin: function (obj) {
    const schema = Joi.object({
      email: Joi.string().email().required().label('Email').messages({
        'any.required': `{#label} is Required`,
      }),
      password: Joi.string().required().label('Password').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
  validateCreateProfile: function (obj) {
    const schema = Joi.object({
      sex: Joi.string().required().label('Sex').messages({
        'any.required': `{#label} is Required`,
      }),
      dateOfBirth: Joi.string().required().label('Date Of Birth').messages({
        'any.required': `{#label} is Required`,
      }),
      height: Joi.number().required().label('Height').messages({
        'any.required': `{#label} is Required`,
      }),
      weight: Joi.number().required().label('Weight').messages({
        'any.required': `{#label} is Required`,
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
      username: Joi.string().required().label('Username').messages({
        'any.required': `{#label} is Required`,
      }),
      email: Joi.string().required().label('Email').messages({
        'any.required': `{#label} is Required`,
      }),
      password: Joi.string().required().label('Password').messages({
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
      password: Joi.string().min(8).max(50).required().label('Password').messages({
        'any.required': `{#label} is Required`,
      }),
    })
    return schema.validate(obj, { allowUnknown: true })
  },
}

