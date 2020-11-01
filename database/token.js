const Sequelize = require('sequelize')
const sequelize = require('./index')
const { NotFoundError } = require('@/helpers/errors')

class Token extends Sequelize.Model {}

Token.init(
  {
    id: {
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    token: Sequelize.STRING(1234)
  },
  { sequelize, modelName: 'token' }
)

Token.logout = async function (token) {
  const isLogout = await Tokens.destroy({ where: { token } })
  if (!isLogout) {
    throw new NotFoundError('token is not found')
  }
  return isLogout
}

module.exports = Token
