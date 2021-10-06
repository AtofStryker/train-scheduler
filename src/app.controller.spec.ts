import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (integration)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Train Schedule Creation', () => {
    it.todo('creates/overwrites a train schedule');
  });

  describe('Train Schedule Intersection', () => {
    it.todo(
      'finds the next closest intersection when two trains arrive at the station simultaneously',
    );

    it.todo(
      ' returns the first time of day when multiple trains arrive at the station simultaneously when no remaining times are available for that day',
    );

    it.todo(
      'returns no time when there are no instances of multiple trains intersecting at the train station',
    );
  });
});
