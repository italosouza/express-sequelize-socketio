const { User } = require('../models')

class UserController {
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

    const list = await User.findAll(filters)
    return res.json(list)
  }

  /**
   * GET/:ID
   */
  async show(req, res) {
    const model = await User.findByPk(req.params.id, { include: ['Perfil'] })

    return res.json(model)
  }

  /**
   * POST
   */
  async store(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'arquivo avatar não informado' })
    }

    const { email } = req.body
    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ error: 'Usuário já cadastrado' })
    }

    const { filename: avatar } = req.file
    req.body.avatar = avatar

    const { perfil_id: pefilID } = req.body

    const user = await User.create({ ...req.body, perfil_id: pefilID })
    req.io.emit('user store', user)

    return res.json(user)
  }

  /**
   * PUT/:ID
   */
  async update(req, res) {
    const { body } = req
    const { id } = req.params

    await User.update(body, { where: { id: id } })

    const updatedModel = await User.findByPk(id)
    req.io.emit('user update', updatedModel)

    return res.json(updatedModel)
  }

  /**
   * DELETE/:ID
   */
  async destroy(req, res) {
    const { id } = req.params
    await User.destroy({ where: { id: id } })
    req.io.emit('user delete', id)

    return res.json({ id })
  }
}

module.exports = new UserController()
