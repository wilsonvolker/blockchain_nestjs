# BlockchainService in nestjs

### Endpoints
#### POST http://{url}/add-block-to-chain
**_Request Body:_**
```bash
{
  block: {
    data: [{
      from: string, // sender public key
      to: string, // recipient public key
      amount: number,
      gas: number,
    }]
  },
  privateKey: string, // sender private key
}
```
**_Return:_**
```bash
{
  userBalance: number,
  chain: [{
    "_timestamp": Date,
    "_hash": string,
    "_nonce": number,
    "_timestamp": string,
    "_prevHash": Optional<string>
  }],
}
```

#### GET http://{url}/get-balance
**_Request Body:_**
```bash
userPublicKey=<string>

e.g. http://{url}/get-balance?userPublicKey=0xcj21351adxxxxxxxx
```
**_Return:_**
```bash
{
  userPublicKey: string,
  balance: number
}
```

### Automated test cases
`./src/app.controller.spec.ts` -> Test endpoints in controller  
`./test/app.blockchain.spec.ts` -> Test add and mine transaction from blockchain    
`./test/app.e2e.spec.ts` -> E2E testing of the application.  

To execute:  
```bash
$ yarn run test:bc
```

### Environment variable
```dotenv
MINT_PRIVATE_KEY=
INIT_HOLDER_PRIVATE_KEY=
```

### References:  
1. [Creating a blockchain in 60 lines of Javascript](https://dev.to/freakcdev297/creating-a-blockchain-in-60-lines-of-javascript-5fka)
2. [Creating a cryptocurrency - Creating transactions, mining rewards, mint and gas fee ](https://dev.to/freakcdev297/creating-transactions-mining-rewards-mint-and-gas-fee-5hhf)
3. [JeChain](https://github.com/nguyenphuminh/JeChain)
4. [Nofer, M., Gomber, P., Hinz, O., & Schiereck, D. (2017). BlockchainService. Business & Information Systems Engineering, 59(3), 183-187.](http://cs.unibo.it/~danilo.montesi/CBD/Articoli/2017Blockchain.pdf)

### Further improvement suggestions 
#### (adding up from time to time, welcome suggestions):
1. Smart contract?
2. proof of stake?

<hr/>

# About Nestjs
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# build app
$ yarn run build

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
