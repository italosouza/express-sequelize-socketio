const Vm = require('../models/Vm')
const Queue = require('../models/Queue')

const QueueJob = require('../jobs/QueueJob')
const QueueService = require('../services/Queue')

class VmController {
  async index(req, res) {
    const filters = {}

    if (req.query.available) {
      filters.available = req.query.available
    }

    if (req.query.name) {
      filters.name = new RegExp(req.query.name, 'i')
    }

    const list = await Vm.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['user'],
      sort: '-createdAt'
    })

    return res.json(list)
  }

  async show(req, res) {
    const model = await Vm.findById(req.params.id)

    return res.json(model)
  }

  async store(req, res) {
    const model = await Vm.create(req.body)

    return res.json(model)
  }

  async update(req, res) {
    const model = await Vm.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    return res.json(model)
  }

  async destroy(req, res) {
    await Vm.findByIdAndDelete(req.params.id)

    return res.send()
  }

  async join(req, res) {
    if (await Vm.findOne({ user: req.userId })) {
      return res.send()
    }

    const queue = await Queue.findOne({ user: req.userId }).populate('user', '-password')

    if (!queue) {
      return res.status(400).json({ error: 'Usuário não estava na fila' })
    }

    const model = await Vm.findByIdAndUpdate(
      req.params.id,
      { user: req.userId, available: false },
      {
        new: true
      }
    )
    model.user = queue.user

    await Queue.findByIdAndDelete(queue._id)

    req.io.emit('vm join', model)
    req.io.emit('queue leave', queue)

    return res.json(model)
  }

  async leave(req, res) {
    const model = await Vm.findByIdAndUpdate(
      req.params.id,
      { user: null, available: true },
      {
        new: true
      }
    )

    QueueService.create(QueueJob.key, {
      vm: model
    }).save()

    req.io.emit('vm leave', model)

    return res.json(model)
  }
}

module.exports = new VmController()
