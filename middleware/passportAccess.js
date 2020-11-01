const BearerStrategy = require('passport-http-bearer').Strategy
const passport = require('passport')
const User = require('@/database/user')
const Token = require('@/database/token')
const { UnauthorizedError } = require('@/helpers/errors')

module.exports.passportAccess = function () {
  passport.use(
    new BearerStrategy(async function (token, done) {
      try {
        const candidate = await User.findOne({
          include: [
            {
              model: Token,
              attributes: ['id'],
              where: { token }
            }
          ],
          attributes: ['id', 'email', 'name', 'description'],
          raw: true
        })
        if (!candidate) {
         throw new UnauthorizedError()
        }
        return done(null, candidate)
      } catch (err) {
        return done(err)
      }
    })
  )
}
