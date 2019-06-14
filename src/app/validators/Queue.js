const Joi = require('joi')

module.exports = {
  body: {
    user: Joi.string().required()
  }
}
