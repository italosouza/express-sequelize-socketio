module.exports = {
  uri: process.env.DB_URL,
  dialect: 'mysql',
  host: '127.0.0.1',
  username: 'coreapp-user',
  password: 'coreapp-pass',
  database: 'donJuan',
  operatorAlias: true,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
}
