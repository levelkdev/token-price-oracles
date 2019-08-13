const _ = require('lodash')
const config = require('./config')

module.exports = (network, tokenSymbol) => {
  const { tokens } = config(network)
  return _.find(tokens, { symbol: tokenSymbol })
}
