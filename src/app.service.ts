import { Injectable } from '@nestjs/common';
import {BlockchainService} from "./blockchain/Blockchain.service";
import {BlockService} from "./blockchain/Block.service";
import {DateTime} from 'luxon'
import {BlockDto} from "./dto/BlockDto";

@Injectable()
export class AppService {
  private bc: BlockchainService;

  constructor() {
    this.bc = new BlockchainService();
  }

  getHello(): string {
    return 'Hello World!';
  }

  addBlockToChain(blockDto: BlockDto): string {
    this.bc.addBlock(
        new BlockService(
            DateTime.now(),
            blockDto.data
        )
    )

    return JSON.stringify(this.bc.chain);
  }
}
