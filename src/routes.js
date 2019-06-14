const express = require('express')
const routes = express.Router()

/**
 * VALIDATORS
 */
const validate = require('express-validation')
const validators = require('./app/validators')
const handler = require('express-async-handler')

const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

/**
 * MIDDLEWARES
 */
const authMiddleware = require('./app/middlewares/auth')

/**
 * CONTROLLERS
 */
const controllers = require('./app/controllers')

/**
 * ROTAS
 */

// usuario
// routes.post(
//   '/user',
//   upload.single('avatar'),
//   validate(validators.User),
//   handler(controllers.UserController.store)
// )

routes.post('/session', validate(validators.Session), handler(controllers.SessionController.store))

// routes.post('/user', upload.single('avatar'), controllers.UserController.store)
routes.get('/files/:file', controllers.FileController.show)

// rotas a sequir requerem Token de autenticação
routes.use(authMiddleware)

// vm
// routes.get('/vm', handler(controllers.VmController.index))
// routes.get('/vm/:id', handler(controllers.VmController.show))
// routes.post('/vm', validate(validators.Vm), handler(controllers.VmController.store))
// routes.put('/vm/:id', validate(validators.Vm), handler(controllers.VmController.update))
// routes.delete('/vm/:id', handler(controllers.VmController.destroy))

// routes.post('/vm/join/:id', handler(controllers.VmController.join))
// routes.post('/vm/leave/:id', handler(controllers.VmController.leave))

// user -
// routes.get('/user', controllers.UserController.index)

// queue
// routes.get('/queue', handler(controllers.QueueController.index))
// routes.post('/queue/join', handler(controllers.QueueController.join))
// routes.post('/queue/leave', handler(controllers.QueueController.leave))

module.exports = routes
