import { Module, Global } from '@nestjs/common';
import {BlockService} from "./Block.service";
import {BlockchainService} from "./Blockchain.service";

@Global()
@Module({
    controllers: [],
    providers: [BlockService, BlockchainService],
    exports: [BlockService, BlockchainService],
})
export class BlockchainModule {}
