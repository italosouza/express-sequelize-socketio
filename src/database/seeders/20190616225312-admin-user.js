'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Administrador',
          email: 'admin@sistema.com',
          avatar: 'placeholder.png',
          created_at: Date.now(),
          updated_at: Date.now(),
          password_hash: '123',
          provider: true
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', { email: 'admin@sistema.com' }, {})
  }
}
