import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  CreateTrainLineScheduleParamDTO,
  CreateTrainLineScheduleBodyDTO,
  FindTrainArrivalIntersectionQueryDTO,
} from './app.dto';

@Controller('trains')
export class AppController {
  @Get('arrivals/next')
  async getNextTrainArrivalIntersection(
    @Query() { arrivalTime }: FindTrainArrivalIntersectionQueryDTO,
  ): Promise<string> {
    // TODO: return military time
    return '';
  }

  @Post(':id/schedule')
  async createTrainLineSchedule(
    @Param() { trainLine }: CreateTrainLineScheduleParamDTO,
    @Body() { arrivalTimes }: CreateTrainLineScheduleBodyDTO,
  ): Promise<void> {
    // TODO: create schedule
    return null;
  }
}
