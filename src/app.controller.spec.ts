import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModuleMock } from './../src/app.module.mock';
import { RedisCacheService } from './cache/redisCache.service';

import { Injectable } from '@nestjs/common';

/**
 * the goal of this module is to mock out redis under test to perform a solid integration test.
 * To prevent over complication, a simple object we purge after every test should suffice
 */
let mockStorage = {};
@Injectable()
export class MockRedisCacheService {
  async fetch(key: string): Promise<string[]> {
    const value = mockStorage[key];
    return value || [];
  }

  async set(key: string, value: string[]): Promise<void> {
    mockStorage[key] = value;
    return undefined;
  }

  async keys(): Promise<string[]> {
    return Object.keys(mockStorage);
  }
}

describe('AppController (integration)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModuleMock],
    })
      .overrideProvider(RedisCacheService)
      .useClass(MockRedisCacheService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    mockStorage = {};
  });

  describe('Train Schedule Creation', () => {
    it('creates a train schedule, inserting the schedule in ascending order', async () => {
      const mockAgent = request.agent(app.getHttpServer());
      const mockTrainLine = 'EW04';
      const mockArrivalTimesNotSorted = ['10:11', '13:54', '11:42'];

      const resp = await mockAgent
        .post(`/trains/${mockTrainLine}/schedule`)
        .send({
          arrivalTimes: mockArrivalTimesNotSorted,
        });

      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({});

      expect(mockStorage['EW04']).toEqual(['10:11', '11:42', '13:54']);
    });

    it('overrides a train schedule, inserting the schedule in ascending order', async () => {
      const mockAgent = request.agent(app.getHttpServer());
      const mockTrainLine = 'ALP5';
      const mockArrivalTimesNotSorted = ['09:55'];

      mockStorage['ALP5'] = ['10:11', '13:54', '11:42'];

      const resp = await mockAgent
        .post(`/trains/${mockTrainLine}/schedule`)
        .send({
          arrivalTimes: mockArrivalTimesNotSorted,
        });

      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({});

      expect(mockStorage['ALP5']).toEqual(['09:55']);
    });
  });

  describe('Train Schedule Intersection', () => {
    it('finds the next closest intersection when two trains arrive at the station simultaneously', async () => {
      mockStorage['ALP5'] = ['10:11', '13:54', '11:42'];
      mockStorage['EW04'] = ['10:25', '11:42', '16:45'];
      mockStorage['WREK'] = ['10:10', '13:57', '16:45'];
      mockStorage['TEST'] = ['09:55', '13:54', '17:00'];

      const mockAgent = request.agent(app.getHttpServer());
      const arrivalTime = '13:07';

      const resp = await mockAgent.get(
        `/trains/arrivals/next?arrivalTime=${arrivalTime}`,
      );

      expect(resp.statusCode).toEqual(200);
      expect(resp.text).toEqual('13:54');
    });

    it('returns the first time of day when multiple trains arrive at the station simultaneously when no remaining times are available for that day', async () => {
      mockStorage['ALP5'] = ['10:11', '13:54', '11:42'];
      mockStorage['EW04'] = ['10:25', '11:42', '16:45'];
      mockStorage['WREK'] = ['10:10', '13:57', '16:45'];
      mockStorage['TEST'] = ['09:55', '13:54', '17:00'];

      const mockAgent = request.agent(app.getHttpServer());
      const arrivalTime = '16:58';

      const resp = await mockAgent.get(
        `/trains/arrivals/next?arrivalTime=${arrivalTime}`,
      );

      expect(resp.statusCode).toEqual(200);
      expect(resp.text).toEqual('11:42');
    });

    it('returns no time when there are no instances of multiple trains intersecting at the train station', async () => {
      mockStorage['ALP5'] = ['10:11', '13:54', '11:42'];
      mockStorage['EW04'] = ['10:25', '11:43', '16:45'];
      mockStorage['WREK'] = ['10:10', '13:57', '16:44'];
      mockStorage['TEST'] = ['09:55', '13:35', '17:00'];

      const mockAgent = request.agent(app.getHttpServer());
      const arrivalTime = '12:00';

      const resp = await mockAgent.get(
        `/trains/arrivals/next?arrivalTime=${arrivalTime}`,
      );

      expect(resp.statusCode).toEqual(200);
      expect(resp.text).toEqual('');
    });
  });
});
