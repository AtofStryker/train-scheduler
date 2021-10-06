import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisCacheService } from './cache/redisCache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: parseInt(configService.get('REDIS_PORT') || '6379'),
        // if no ttl provided, default to 1 hour
        ttl: parseInt(configService.get('REDIS_TTL') || '3600'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RedisCacheService],
})
export class AppModule {}
