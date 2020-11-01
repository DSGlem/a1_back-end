const Sequelize = require('sequelize')
const sequelize = require('./index')

class Image extends Sequelize.Model {}

Image.init(
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
    link: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  { sequelize, modelName: 'image' }
)

module.exports = Image
