import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisCacheService } from './cache/redisCache.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RedisCacheService],
})
export class AppModuleMock {}
