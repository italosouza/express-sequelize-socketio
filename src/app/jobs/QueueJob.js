const Mail = require('../services/Mail')
const Queue = require('../models/Queue')

class QueueJob {
  get key() {
    return 'QueueMail'
  }

  async handle(job, done) {
    const { vm } = job.data

    const queue = await Queue.findOne({}, {}, { sort: { created_at: 1 } }).populate('user')

    if (queue) {
      await Mail.sendMail({
        from: '"vmQueue" <vm@queue.com.br>',
        to: queue.user.email,
        subject: `VM ${vm.name} disponível`,
        template: 'disponivel',
        context: {
          settings: {
            views: 'views'
          },
          vm,
          queue
        }
      })
    }

    return done()
  }
}

module.exports = new QueueJob()
