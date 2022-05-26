import { Injectable } from '@nestjs/common';
import {Blockchain} from "./blockchain/Blockchain";
import {Block} from "./blockchain/Block";
import {DateTime} from 'luxon'
import {BlockDto} from "./dto/BlockDto";

@Injectable()
export class AppService {
  private bc: Blockchain;

  constructor() {
    this.bc = new Blockchain();
  }

  getHello(): string {
    return 'Hello World!';
  }

  addBlockToChain(blockDto: BlockDto): string {
    this.bc.addBlock(
        new Block(
            DateTime.now(),
            blockDto.data
        )
    )

    return JSON.stringify(this.bc.chain);
  }
}
