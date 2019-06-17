const Joi = require('joi')

module.exports = {
  body: {
    name: Joi.string().required(),
    perfil_id: Joi.number().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(6),
    avatar: Joi.any()

      .meta({ swaggerType: 'file' })
      .description('arquivo de imagem do avatar')
  }
}
