import { Module, Global } from '@nestjs/common';
import {genSigningKey} from "./keypairs.service";

@Global()
@Module({
    controllers: [],
    providers: [genSigningKey],
    exports: [genSigningKey],
})
export class utilsModule {}
