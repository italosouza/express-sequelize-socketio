require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// const mongoose = require('mongoose')
// const databaseConfig = require('./config/database')

const validate = require('express-validation')
const Youch = require('youch')

const Sentry = require('@sentry/node')
const sentryConfig = require('./config/sentry')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.sentry()
    this.database()
    this.middlewares()
    // this.routes() //routes must be defined after socket.io
    this.exception()
  }

  database() {}

  middlewares() {
    this.express.use(cors())
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(bodyParser.json())
    this.express.use(methodOverride())
    this.express.use(Sentry.Handlers.requestHandler())
    this.express.use(express.static(path.resolve(__dirname, 'public')))
  }

  routes() {
    this.express.use(require('./routes'))
  }

  sentry() {
    Sentry.init(sentryConfig)
  }

  exception() {
    if (!this.isDev) {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (this.isDev) {
        const youch = new Youch(err)
        return res.json(await youch.toJSON())
      }

      return res.status(err.status || 500).json({ error: 'Erro interno do servidor' })
    })
  }

  configIoMiddleware(io) {
    this.express.use((req, res, next) => {
      req.io = io
      return next()
    })
  }
}

module.exports = new App()
