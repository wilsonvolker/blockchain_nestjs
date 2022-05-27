import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

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

        // TODO: Need to construct a test case
        
    });
});
