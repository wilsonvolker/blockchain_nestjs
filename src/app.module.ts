import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {genSigningKey} from "./utils/keypairs";

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ".env",
    isGlobal: true,
  }), genSigningKey],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
