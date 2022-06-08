import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {BlockchainService} from "./blockchain/Blockchain.service";
import {BlockService} from "./blockchain/Block.service";
import {DateTime} from 'luxon'
import {BlockDto} from "./dto/BlockDto";
import {genSigningKey} from "./utils/keypairs.service";
import {TransactionDto} from "./dto/TransactionDto";

@Injectable()
export class AppService {
  private bc: BlockchainService;

  constructor() {
    this.bc = new BlockchainService();
  }

  getHello(): string {
    return 'Hello World!';
  }

  addBlockToChain(blockDto: BlockDto, privateKey: string): string {
    // this.bc.addBlock(
    //     new BlockService(
    //         DateTime.now(),
    //         blockDto.data
    //     )
    // )
    //
    // return JSON.stringify(this.bc.chain);
    const userKeyPair: genSigningKey = genSigningKey.getKeyPairFromPrivateKey(privateKey);
    // console.log("Balance ", this.bc.getBalance(userKeyPair.publicKey))

    for(let i=0; i<blockDto.data.length; i++){
      // const tmpTx: TransactionDto = <TransactionDto>blockDto.data[i];
      const tmpTx: TransactionDto = TransactionDto.parseFromObject(blockDto.data[i]);
      // console.log(tmpTx)
      // console.log(tmpTx.to)
      if (typeof tmpTx.to === "undefined") {
        throw new HttpException(`Missing recipient of transaction: ${JSON.stringify(tmpTx)}`, HttpStatus.BAD_REQUEST)
      }
      if (typeof tmpTx.amount === "undefined") {
        throw new HttpException(`Missing amount in transaction: ${JSON.stringify(tmpTx)}`, HttpStatus.BAD_REQUEST)
      }
      tmpTx.from = userKeyPair.publicKey;
      tmpTx.sign(userKeyPair.signingKeyPair);

      this.bc.addTransaction(tmpTx)
    }

    this.bc.mineTransaction(userKeyPair.publicKey);

    const result = {
      userBalance: this.bc.getBalance(userKeyPair.publicKey),
      chain: this.bc.chain
    }
    return JSON.stringify(result);
  }

  getBalance(publicKey: string): number {
    return this.bc.getBalance(publicKey);
  }
}
