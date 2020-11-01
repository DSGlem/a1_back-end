const auth = require('./auth')
// const product = require("@/database/product");

module.exports = function (server) {
  server.use('/api', auth)
  // server.use("/api", product);
}
