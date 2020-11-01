const User = require('@/database/user')
const Token = require('@/database/token')
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ResponseSender = require('@/helpers/responseSender')

const { WrongParametersError, UnprocessableEntity } = require('@/helpers/errors')

const { getResetPasswordLayout, getConfirmRegisterLayout } = require('@/helpers/mails')

const options = {
  auth: {
    api_key: process.env.MAIL_API_KEY
  }
}


const mailer = nodemailer.createTransport(sgTransport(options))

module.exports.register = async function (req, res, next) {
  console.log(123)
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new UnprocessableEntity({ message: errors.array()[0].msg })
    }

    const candidate = await User.findOne({ where: { email: req.body.email } })

    if (candidate) {
      throw new WrongParametersError({ message: 'user already exist' })
    }
    const token = jwt.sign({ body: req.body }, process.env.JWT_SECRET, {
      expiresIn: 3600 * 30 * 1000
    })

    await mailer.sendMail(getConfirmRegisterLayout(req.body.email, token))
    return new ResponseSender(req, res).send({
      data: {
        message: 'To continue registration, go to the specified mailing address in next 30 min'
      }
    })
  } catch (e) {
    next(e)
  }
}

module.exports.confirm = async function (req, res, next) {
  try {
    const { body } = jwt.verify(req.params.token, process.env.JWT_SECRET)

    if (!body) {
      throw new WrongParametersError({ message: 'Wrong data' })
    }
    const candidate = await User.findOne({ where: { email: body.email } })

    if (candidate) {
      throw new WrongParametersError({ message: 'user already exist' })
    }

    const user = await User.createUser(body)
    console.log(user)
    if (!user) {
      throw new WrongParametersError({ message: 'Wrong data' })
    }
    return new ResponseSender(req, res).send({
      code: 201,
      data: {
        message: 'user successfully registered'
      }
    })
  } catch (e) {
    next(e)
  }
}

module.exports.getLoginUser = async function (req, res, next) {
  try {
    // const userToken = await Token.findOne({ token: req.token })

    // const options = !req.remember ? { expiresIn: 3600 * 30 * 1000 } : null

    // const token = jwt.sign({ user: req.user, remember: !options }, process.env.JWT_SECRET, options)

    // await userToken.update({ token })

    console.log(req.user)

    return new ResponseSender(req, res).send({
      data: {
        user: req.user,
        // token
      }
    })
  } catch (e) {
    next(e)
  }
}

module.exports.login = async function (req, res, next) {
  try {
    const candidate = await User.findOne({ where: { email: req.body.email } })

    if (!candidate) {
      throw new WrongParametersError({ message: 'Wrong email or password' })
    }
console.log(req.body.password)
    const match = await candidate.validPassword(req.body.password)

    if (!match) {
      throw new WrongParametersError({ message: 'Wrong email or password' })
    }
    const {
      // eslint-disable-next-line no-unused-vars
      dataValues: { password, ...rest }
    } = candidate


    const responseToken = jwt.sign({ user: rest }, process.env.JWT_SECRET, { expiresIn: 3600 * 30 * 1000 })

    await Token.create({ token: responseToken, userId: candidate.id })

    return new ResponseSender(req, res).send({
      data: {
        user: rest,
        token: responseToken
      }
    })
  } catch (e) {
    next(e)
  }
}

module.exports.logout = async function (req, res, next) {
  try {
    await Token.logout(req.token)

    return new ResponseSender(req, res).send({
      data: {
        message: 'you are logout',
        token: ''
      }
    })
  } catch (e) {
    next(e)
  }
}
