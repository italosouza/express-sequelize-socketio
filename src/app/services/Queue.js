const kue = require('kue')
const redisConfig = require('../../config/redis')
const jobs = require('../jobs')

const Sentry = require('@sentry/node')

const Queue = kue.createQueue({ redis: redisConfig })

Queue.process(jobs.QueueJob.key, jobs.QueueJob.handle)

Queue.on('error', Sentry.captureException)

module.exports = Queue
