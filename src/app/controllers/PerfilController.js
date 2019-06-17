const { Perfil } = require('../models')

class PerfilController {
  async index(req, res) {
    const filters = {}

    if (req.query.available) {
      filters.available = req.query.available
    }

    if (req.query.name) {
      filters.name = new RegExp(req.query.name, 'i')
    }

    const list = await Perfil.findAll(filters)

    return res.json(list)
  }

  async show(req, res) {
    const model = await Perfil.findByPk(req.params.id)

    return res.json(model)
  }

  async store(req, res) {
    const perfil = await Perfil.create(req.body)
    req.io.emit('perfil store', perfil)

    return res.json(perfil)
  }

  async update(req, res) {
    const model = await Perfil.update(req.body, {
      where: {
        id: req.params.id
      }
    })

    req.io.emit('perfil update', model)

    return res.json(model)
  }

  async destroy(req, res) {
    await Perfil.destroy({ id: req.params.id })
    req.io.emit('perfil destroy', req.params.id)

    return res.send()
  }
}

module.exports = new PerfilController()
