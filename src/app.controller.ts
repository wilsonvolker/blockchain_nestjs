import {Body, Controller, Get, Header, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {BlockDto} from "./dto/BlockDto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post("/add-block-to-chain")
  // @Header("content-type", "application/json")
  // addBlockToChain(@Body() blockDto: BlockDto): string {
  //   console.log("env ", process.env.reward_issuer_address)
  //   return this.appService.addBlockToChain(blockDto);
  // }
}
