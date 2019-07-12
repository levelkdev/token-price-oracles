require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8546,
      network_id: '*', // Match any network id
      gas: 6000000
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8546,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    }
  },

  compilers: {
    solc: {
      version: '0.4.24' // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}
