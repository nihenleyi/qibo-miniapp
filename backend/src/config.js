const path = require('path')

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'qibo_wenzhen_jwt_secret_2024',
  JWT_EXPIRES_IN: '7d',
  DB_PATH: path.join(__dirname, '..', 'data', 'qibo.db')
}
