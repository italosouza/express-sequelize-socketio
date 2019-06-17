const User = require('../models')

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
    const model = await User.findById(req.params.id)

    return res.json(model)
  }

  async store(req, res) {
    const { email } = req.body

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Usuário já cadastrado' })
    }

    const { filename: avatar } = req.file
    req.body.avatar = avatar

    const user = await User.create(req.body)
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
