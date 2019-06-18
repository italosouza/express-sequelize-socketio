const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar: DataTypes.STRING,
      password: DataTypes.VIRTUAL,
      password_hash: DataTypes.STRING,
      provider: DataTypes.BOOLEAN
    },
    {
      hooks: {
        beforeSave: async user => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8)
          }
        }
      }
    },
    {
      freezeTableName: true,
      tableName: 'users'
    }
  )

  User.associate = models => {
    User.belongsTo(models.Perfil, { foreignKey: 'perfil_id' })
  }

  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password_hash)
  }

  User.prototype.compareHash = function(password) {
    return bcrypt.compare(password, this.password)
  }

  return User
}

// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     return next()
//   }
//   this.password = await bcrypt.hash(this.password, 8)
// })

// UserSchema.methods = {
//   compareHash(password) {
//     return bcrypt.compare(password, this.password)
//   }
// }

// UserSchema.statics = {
//   generateToken({ id }) {
//     return jwt.sign({ id }, authConfig.secret, {
//       expiresIn: authConfig.ttl
//     })
//   }
// }

// module.exports = mongoose.model('User', UserSchema)
