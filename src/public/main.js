$(function() {
  var FADE_TIME = 150 // ms
  var TYPING_TIMER_LENGTH = 400 // ms
  const COLORS = [
    '#e21400',
    '#91580f',
    '#f8a700',
    '#f78b00',
    '#58dc00',
    '#287b00',
    '#a8f07a',
    '#4ae8c4',
    '#3b88eb',
    '#3824aa',
    '#a700ff',
    '#d300e7'
  ]

  // Initialize variables
  var $window = $(window)
  var $usernameInput = $('.usernameInput')
  var $messages = $('.messages')
  var $inputMessage = $('.inputMessage')

  var $loginPage = $('.login.page')
  var $chatPage = $('.chat.page')

  // Prompt for setting a username
  var username
  var connected = false
  var typing = false
  var lastTypingTime
  var $currentInput = $usernameInput.focus()

  var socket = io()

  const addParticipantsMessage = data => {
    var message = ''
    // if (data.numUsers === 1) {
    //   message += '1 participante'
    // } else {
    //   message += data.numUsers + ' participantes'
    // }
    log(message)
  }

  const setUsername = () => {
    username = cleanInput($usernameInput.val().trim())

    if (username) {
      $loginPage.fadeOut()
      $chatPage.show()
      $loginPage.off('click')
      $currentInput = $inputMessage.focus()

      socket.emit('add user', username)
    }
  }

  // Sends a chat message
  const sendMessage = () => {
    var message = $inputMessage.val()

    message = cleanInput(message)

    if (message && connected) {
      $inputMessage.val('')
      // addChatMessage({
      //   username: username,
      //   message: message
      // })
      socket.emit('new message', message)
    }
  }

  // Log a message
  const log = (message, options) => {
    var $el = $('<li>')
      .addClass('log')
      .text(message)
    addMessageElement($el, options)
  }

  const addChatMessage = (data, options) => {
    var $typingMessages = getTypingMessages(data)
    options = options || {}
    if ($typingMessages.length !== 0) {
      options.fade = false
      $typingMessages.remove()
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username))
    var $messageBodyDiv = $('<span class="messageBody">').text(data.message)

    var typingClass = data.typing ? 'typing' : ''
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv)

    addMessageElement($messageDiv, options)
  }

  // Adds the visual chat typing message
  const addChatTyping = data => {
    data.typing = true
    data.message = 'digitando..'
    addChatMessage(data)
  }

  // Removes the visual chat typing message
  const removeChatTyping = data => {
    getTypingMessages(data).fadeOut(function() {
      $(this).remove()
    })
  }

  const addMessageElement = (el, options) => {
    var $el = $(el)

    // Setup default options
    if (!options) {
      options = {}
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME)
    }
    if (options.prepend) {
      $messages.prepend($el)
    } else {
      $messages.append($el)
    }
    $messages[0].scrollTop = $messages[0].scrollHeight
  }

  const cleanInput = input => {
    return $('<div/>')
      .text(input)
      .html()
  }

  // Updates the typing event
  const updateTyping = () => {
    if (connected) {
      if (!typing) {
        typing = true
        socket.emit('typing')
      }
      lastTypingTime = new Date().getTime()

      setTimeout(() => {
        var typingTimer = new Date().getTime()
        var timeDiff = typingTimer - lastTypingTime
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing')
          typing = false
        }
      }, TYPING_TIMER_LENGTH)
    }
  }

  const getTypingMessages = data => {
    return $('.typing.message').filter(function(i) {
      return $(this).data('username') === data.username
    })
  }

  const getUsernameColor = username => {
    var hash = 7
    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash
    }

    var index = Math.abs(hash % COLORS.length)
    return COLORS[index]
  }

  // Keyboard events
  $window.keydown(event => {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus()
    }

    if (event.which === 13) {
      if (username) {
        sendMessage()
        socket.emit('stop typing')
        typing = false
      } else {
        setUsername()
      }
    }
  })

  $inputMessage.on('input', () => {
    updateTyping()
  })

  // Click events
  $loginPage.click(() => {
    $currentInput.focus()
  })

  $inputMessage.click(() => {
    $inputMessage.focus()
  })

  // Socket events
  socket.on('login', data => {
    connected = true

    var message = 'Bem vindo ' + data.username
    log(message, {
      prepend: false
    })
    addParticipantsMessage(data)
  })

  socket.on('new message', data => {
    addChatMessage(data)
  })

  socket.on('tweet', data => {
    const tweet = { username: data.author, message: data.content }
    addChatMessage(tweet)
  })

  socket.on('queue join', data => {
    console.log(data)
    const tweet = { username: 'SysOp', message: `${data.user.name} entrou na fila de espera.` }
    addChatMessage(tweet)
  })

  socket.on('queue leave', data => {
    console.log(data)
    const tweet = {
      username: 'SysOp',
      message: `${data.user.name} saiu da fila de espera.`
    }
    addChatMessage(tweet)
  })

  socket.on('vm leave', data => {
    console.log(data)
    const tweet = {
      username: 'SysOp',
      message: `VM '${data.name}' liberada, atenção próximo da fila.`
    }
    addChatMessage(tweet)
  })

  socket.on('vm join', data => {
    console.log(data)
    const tweet = {
      username: 'SysOp',
      message: `Vm '${data.name}' está sendo usada agora.`
    }
    addChatMessage(tweet)
  })

  socket.on('like', data => {
    log(`Um post do ${data.author} ganhou uma curtida`)
  })

  socket.on('user joined', data => {
    log(data.username + ' entrou.')
    addParticipantsMessage(data)
  })

  socket.on('user left', data => {
    // log(data.username + ' saiu.')
    var message = data.username + ' saiu da sala.'
    log(message, {
      prepend: false
    })
    addParticipantsMessage(data)
    removeChatTyping(data)
  })

  socket.on('typing', data => {
    addChatTyping(data)
  })

  socket.on('stop typing', data => {
    removeChatTyping(data)
  })

  socket.on('disconnect', () => {
    log('você foi desconectado.')
  })

  socket.on('reconnect', () => {
    log('conexão restabelecida.')
    if (username) {
      socket.emit('add user', username)
    }
  })

  socket.on('reconnect_error', () => {
    log('não foi possível reconectar.')
  })
})
