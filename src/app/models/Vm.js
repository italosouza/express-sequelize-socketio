module.exports = (sequelize, DataTypes) => {
  const Vm = sequelize.define('Vm', {
    date: DataTypes.DATE
  })

  Vm.associete = models => {
    Vm.belongsTo(models.User, { foreignKey: 'user_id' })
    Vm.belongsTo(models.User, { foreignKey: 'provider_id' })
  }

  return Vm
}
