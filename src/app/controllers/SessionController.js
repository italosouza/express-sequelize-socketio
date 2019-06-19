const { User } = require('../models')

class SessionController {
  async store(req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' })
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Senha inválida' })
    }

    return res.json({ user, token: user.generateToken(user) })
  }
}

module.exports = new SessionController()
