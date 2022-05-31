import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {BlockchainModule} from "./blockchain/Blockchain.module";
import {utilsModule} from "./utils/utils.module";

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ".env",
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService, BlockchainModule, utilsModule],
})
export class AppModule {}
