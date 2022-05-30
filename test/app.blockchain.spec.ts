import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {genSigningKey} from "../src/utils/keypairs";
import {TransactionDto} from "../src/dto/TransactionDto";
import {Blockchain} from "../src/blockchain/Blockchain";
import {MINT_KEY_PAIR, MINT_PUBLIC_ADDRESS} from "../src/utils/addresses";

describe('Blockchain test', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Test add and mine transaction from blockchain', () => {
        // console.log("running test")
        // return request(app.getHttpServer())
        //     .get('/')
        //     .expect(200)
        //     .expect('Hello World!');

        // initialise the original balance for myWallet (using genesis block)
        const blockchain: Blockchain = new Blockchain();

        const myPublicKey: string = blockchain.chain[0].data[0].to;

        const fdsWallet: genSigningKey = new genSigningKey();
        // const fdsTransaction = new TransactionDto(
        //     myPublicKey,
        //     fdsWallet.publicKey,
        //
        // )
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

        console.log(MINT_PUBLIC_ADDRESS)
        expect(typeof MINT_PUBLIC_ADDRESS).toBe("string")
        expect(MINT_KEY_PAIR.getPrivate("hex")).toBe(process.env.MINT_PRIVATE_KEY)

        const kp: genSigningKey = new genSigningKey(process.env.MINT_PRIVATE_KEY);
        console.log(kp.publicKey)
        expect(typeof kp.publicKey).toBe("string")
        expect(kp.privateKey).toBe(process.env.MINT_PRIVATE_KEY)
    })
});
