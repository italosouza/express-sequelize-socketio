module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define('Queue', {
    date: DataTypes.DATE
  })

  Queue.associete = models => {
    Queue.belongsTo(models.User, { foreignKey: 'user_id' })
    Queue.belongsTo(models.User, { foreignKey: 'provider_id' })
  }

  return Queue
}
