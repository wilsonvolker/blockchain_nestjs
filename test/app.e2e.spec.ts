import { Test, TestingModule } from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {genSigningKey} from "../src/utils/keypairs.service";
import {TransactionDto} from "../src/dto/TransactionDto";
import {BlockDto} from "../src/dto/BlockDto";
import exp from "constants";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Test add block of transactions to chain', () => {
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

    return request(app.getHttpServer())
        .post('/add-block-to-chain')
        .send(payload)
        .expect(HttpStatus.CREATED)
        .then((result) => {
          console.log(result.body)

          const {userBalance, chain} = result.body;
          expect(userBalance).toEqual(100000 - (100 + 12) - 5000 - 400 + (500+12));
          expect(Array.isArray(chain)).toBe(true);
          expect(chain.length > 0).toBe(true);
          chain.forEach((x) => {
            expect(x).toEqual({
              ...x,
              _data: expect.any(Array),
              _hash: expect.any(String),
              _nonce: expect.any(Number),
              // _prevHash: expect.any(String),
              _timestamp: expect.any(String),
            })
          })
        })

        // .expect('Hello World!');
  })

  it("Test check user balance", () => {
    const userKeyPair: genSigningKey = genSigningKey.getKeyPairFromPrivateKey(process.env.INIT_HOLDER_PRIVATE_KEY);

    return request(app.getHttpServer())
        .get(`/get-balance?userPublicKey=${userKeyPair.publicKey}`)
        // .send({
        //   userPublicKey: userKeyPair.publicKey
        // })
        .expect(HttpStatus.OK)
        .then((result) => {
          console.log(result.body)
          const {userPublicKey, balance} = result.body;
          expect(userPublicKey).toEqual(userKeyPair.publicKey);
          expect(balance).toEqual(100000);
        })
  })
});
