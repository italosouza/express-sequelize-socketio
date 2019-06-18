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

  // Perfil.associate = models => {
  //   Perfil.hasOne(models.User)
  // }

  return Perfil
}
