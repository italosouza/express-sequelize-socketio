const { Perfil } = require('../models')

class PerfilController {
  /**
   * GET
   */
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

  /**
   * GET/:ID
   */
  async show(req, res) {
    const model = await Perfil.findByPk(req.params.id)

    return res.json(model)
  }

  /**
   * POST
   */
  async store(req, res) {
    const perfil = await Perfil.create(req.body)
    req.io.emit('perfil store', perfil)

    return res.json(perfil)
  }

  /**
   * PUT/:ID
   */
  async update(req, res) {
    const { body } = req
    const { id } = req.params

    await Perfil.update(body, { where: { id: id } })

    const updatedModel = await Perfil.findByPk(id)
    req.io.emit('perfil update', updatedModel)

    return res.json(updatedModel)
  }

  /**
   * DELETE/:ID
   */
  async destroy(req, res) {
    const { id } = req.params
    await Perfil.destroy({ where: { id: id } })
    req.io.emit('perfil delete', id)

    return res.json({ id })
  }
}

module.exports = new PerfilController()
