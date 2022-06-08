import {Body, Controller, Get, Header, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {BlockDto} from "./dto/BlockDto";
import {BlockchainService} from "./blockchain/Blockchain.service";
import {genSigningKey} from "./utils/keypairs.service";
import {TransactionDto} from "./dto/TransactionDto";
import {transcode} from "buffer";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/add-block-to-chain")
  @Header("content-type", "application/json")
  addBlockToChain(@Body("block") blockDto: BlockDto, @Body("privateKey") privateKey: string): string {
    // console.log("env ", process.env.reward_issuer_address)
    return this.appService.addBlockToChain(blockDto, privateKey);
  }

  @Get("/get-balance")
  @Header("content-type", "application/json")
  getBalance(@Param("userPublicKey") userPublicKey: string): string {
    return JSON.stringify({
      userPublicKey,
      balance: this.appService.getBalance(userPublicKey),
    });
  }
}
