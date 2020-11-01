const Sequelize = require('sequelize')
const sequelize = require('./index')
class Product extends Sequelize.Model {}

Product.init(
  {
    id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    label: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    }
  },
  { sequelize, modelName: 'product' }
)

module.exports = Product
