import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {genSigningKey} from "../src/utils/keypairs.service";
import {TransactionDto} from "../src/dto/TransactionDto";
import {BlockchainService} from "../src/blockchain/Blockchain.service";
import {initializeInstance} from "ts-loader/dist/instances";
// import {MINT_KEY_PAIR, MINT_PUBLIC_ADDRESS} from "../src/utils/addresses";

describe('BlockchainService test', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Test generating key pairs', () => {
        const kp = new genSigningKey();

        console.log("Public Key", kp.publicKey)
        expect(typeof kp.publicKey).toBe("string");

        console.log("Private Key", kp.privateKey)
        expect(typeof kp.privateKey).toBe("string");
    })

    it('Test calculating MINT public key', () => {
        // console.log(MINT_PUBLIC_ADDRESS);
        // expect(typeof MINT_PUBLIC_ADDRESS).toBe("string")

        console.log(genSigningKey.MINT_PUBLIC_ADDRESS);
        expect(typeof genSigningKey.MINT_PUBLIC_ADDRESS).toBe("string")
        expect(genSigningKey.MINT_KEY_PAIR.getPrivate("hex")).toBe(process.env.MINT_PRIVATE_KEY)

        const kp: genSigningKey = new genSigningKey(process.env.MINT_PRIVATE_KEY);
        console.log(kp.publicKey)
        expect(typeof kp.publicKey).toBe("string")
        expect(kp.privateKey).toBe(process.env.MINT_PRIVATE_KEY)
    })

    it('Test add and mine transaction from blockchain', () => {
        // console.log("running test")
        // return request(app.getHttpServer())
        //     .get('/')
        //     .expect(200)
        //     .expect('Hello World!');

        // initialise the original balance for myWallet (using genesis block)
        const blockchain: BlockchainService = new BlockchainService();
        const myKeyPair: genSigningKey = genSigningKey.getKeyPairFromPrivateKey(process.env.INIT_HOLDER_PRIVATE_KEY);

        console.log("Initial balance:", blockchain.getBalance(myKeyPair.publicKey))

        // send money to friend's wallet
        const fdsWallet: genSigningKey = new genSigningKey();
        //  create transaction
        const transaction = new TransactionDto(
            myKeyPair.publicKey,
            fdsWallet.publicKey,
            100,
            10
        );
        transaction.sign(myKeyPair.signingKeyPair)


        // console.log(transaction)
        //  add transaction to pool
        blockchain.addTransaction(transaction);
        //  mine transaction
        blockchain.mineTransaction(myKeyPair.publicKey);

        const myBalance = blockchain.getBalance(myKeyPair.publicKey);
        const fdsBalance = blockchain.getBalance(fdsWallet.publicKey);
        console.log("My public key: ", myKeyPair.publicKey);
        console.log("My balance: ", myBalance);

        console.log("Friend's public key: ", fdsWallet.publicKey)
        console.log("Friend's balance: ", fdsBalance)

        expect(myBalance).toBe(100000 + (-100) + (-10) + 500 + 10);
        expect(fdsBalance).toBe(100);
    });
});
