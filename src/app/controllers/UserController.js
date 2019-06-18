const { User } = require('../models')

class UserController {
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

  async show(req, res) {
    const model = await User.findByPk(req.params.id)

    return res.json(model)
  }

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

  async update(req, res) {
    const model = await User.update(req.body, {
      where: {
        id: req.params.id
      }
    })

    req.io.emit('user update', model)

    return res.json(model)
  }

  async destroy(req, res) {
    await User.destroy({ id: req.params.id })
    req.io.emit('user destroy', req.params.id)

    return res.send()
  }
}

module.exports = new UserController()
