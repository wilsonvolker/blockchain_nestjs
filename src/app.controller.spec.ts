import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TransactionDto} from "./dto/TransactionDto";
import {genSigningKey} from "./utils/keypairs.service";
import {BlockDto} from "./dto/BlockDto";
import {AppModule} from "./app.module";

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            // controllers: [AppController],
            // providers: [AppService],
            imports: [AppModule],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });

    describe('Test blockchain', function () {
        it("Integrated test on adding transaction to chain", () => {
            const userKeyPair: genSigningKey = genSigningKey.getKeyPairFromPrivateKey(process.env.INIT_HOLDER_PRIVATE_KEY);
            const dummyKeyPairs: genSigningKey[] = [
                new genSigningKey(),
                new genSigningKey(),
                new genSigningKey(),
            ];

            const tx: TransactionDto[] = [
                new TransactionDto(
                    userKeyPair.publicKey,
                    dummyKeyPairs[0].publicKey,
                    100,
                    12
                ),
                new TransactionDto(
                    userKeyPair.publicKey,
                    dummyKeyPairs[1].publicKey,
                    5000,
                    0
                ),
                new TransactionDto(
                    userKeyPair.publicKey,
                    dummyKeyPairs[2].publicKey,
                    400
                ),
            ]

            const payload: {block: BlockDto, privateKey: string} = {
                block: {
                    data: tx,
                },
                privateKey: userKeyPair.privateKey
            }

            const result: string = appController.addBlockToChain(payload.block, payload.privateKey);
            const expectedBalance: number = 100000 - (100 + 12) - 5000 - 400 + (500+12);
            // console.log("result\n", JSON.stringify(result));

            expect(userKeyPair.privateKey).toBe(process.env.INIT_HOLDER_PRIVATE_KEY)
            expect(JSON.parse(result).userBalance).toBe(expectedBalance)
        })
    });
});
