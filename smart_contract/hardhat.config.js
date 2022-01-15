// https://eth-ropsten.alchemyapi.io/v2/F91nmT6c9kB0rHNKcgC0OL0oZSYCoGEK

// plugin to build smart contract tests
require('@nomiclabs/hardhat-waffle');


module.exports = {
  solidity: '0.8.0', 
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/F91nmT6c9kB0rHNKcgC0OL0oZSYCoGEK',
      accounts: ['127c8b939e5410231078f9b33eed466953fc2ccbfd6bf113236669737c040fe5']
    }
  }
}