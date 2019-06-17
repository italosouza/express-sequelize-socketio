module.exports = (sequelize, DataTypes) => {
  const Perfil = sequelize.define(
    'Perfil',
    {
      name: DataTypes.STRING
    },
    {
      freezeTableName: true,
      tableName: 'perfil'
    }
  )

  Perfil.associete = models => {
    Perfil.hasOne(models.User, { foreignKey: 'perfil_id' })
  }

  return Perfil
}
