const uuidv4 = require('uuid/v4')

module.exports = (http, app) => {
  // configuração do socket.io
  const io = require('socket.io')(http)

  io.on('connection', function(socket) {
    console.log('Nova conexão estabelecida.')

    socket.on('add user', username => {
      const user = { _id: uuidv4(), username: username, numUsers: 1 }
      socket.user = user
      io.emit('login', user)
      console.log(`Usuário ${user.username} id: ${user._id} conectado`)
    })

    socket.on('new message', data => {
      const message = { username: socket.user.username, message: data }
      if (app.isDev) {
        console.log(message)
      }
      io.emit('new message', message)
    })

    socket.on('disconnect', () => {
      console.log(`${socket.user} desconectou-se.`)
    })
  })

  return io
}
