require('babel-register')
require('babel-polyfill')

const HDWalletProvider = require('truffle-hdwallet-provider')
const fs = require('fs')

// first read in the secrets.json to get our mnemonic
let secrets
let mnemonic
let infuraProjectID
if (fs.existsSync('secrets.json')) {
  secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))
  mnemonic = secrets.mnemonic
  infuraProjectID = secrets.infuraProjectID
} else {
  console.log('no secrets.json found. You can only deploy to the testrpc.')
  mnemonic = ''
}

module.exports = {
  networks: {
    mainnet: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraProjectID}`)
      },
      network_id: '1',
      gas: 6000000,
      gasPrice: 15 * 10 ** 9,
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraProjectID}`)
      },
      network_id: '4',
      gas: 6000000,
      gasPrice: 30 * 10 ** 9,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraProjectID}`)
      },
      network_id: '3',
      gas: 6000000,
      gasPrice: 30 * 10 ** 9,
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${infuraProjectID}`)
      },
      network_id: '42',
      gas: 6000000,
      gasPrice: 30 * 10 ** 9,
    },
    development: {
      host: 'localhost',
      port: 8546,
      network_id: '*',
      gas: 6000000,
      gasPrice: 30 * 10 ** 9,
    },
    rpc: {
      network_id: '*',
      host: 'localhost',
      port: 8545,
      gas: 6.9e6,
      gasPrice: 15000000001
    }
  },
  compilers: {
    solc: {
      version: '0.4.24' // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}
