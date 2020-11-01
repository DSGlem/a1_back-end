const Sequelize = require('sequelize')
const Image = require('./image')
const Product = require('./product')
const Token = require('./token')
const sequelize = require('./index')
const bcrypt = require('bcrypt')

class User extends Sequelize.Model {
  static createUser = async function (body) {
    try {
      const password = await bcrypt.hash(body.password, 10);
      return await this.create({
        user_name: body.user_name,
        password,
        email: body.email.toLowerCase(),
      });
    } catch (e) {
      throw new Error(e);
    }
  };

  validPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };
}

User.init(
  {
    id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    }
  },
  { sequelize, modelName: 'user' }
)

User.hasOne(Image, { foreignKey: 'userId', onDelete: 'cascade' })
User.hasMany(Product, { foreignKey: 'userId', onDelete: 'cascade' })
User.hasMany(Token, { foreignKey: 'userId', onDelete: 'cascade' })


module.exports = User
