import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import {
  CreateTrainLineScheduleParamDTO,
  CreateTrainLineScheduleBodyDTO,
  FindTrainArrivalIntersectionQueryDTO,
} from './app.dto';
import { AppService } from './app.service';

@Controller('trains')
@ApiTags('trains')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiQuery({
    name: 'arrivalTime',
    type: String,
    required: true,
    description: `The nest arrival time, in military time, 
    where two or more trains arrive simultaneously. 
    If no other trains intersect that day, the first intersection is returned for the next day. 
    If no intersection exists at all, null is returned`,
  })
  @Get('arrivals/next')
  async getNextTrainArrivalIntersection(
    @Query() { arrivalTime }: FindTrainArrivalIntersectionQueryDTO,
  ): Promise<string | null> {
    const nextTrainIntersectionalArrival =
      await this.appService.findTrainScheduleIntersection(arrivalTime);
    return nextTrainIntersectionalArrival;
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description:
      'The name of the train line. Examples include "EWR0", "ALP5", "TOMO". Must be Alpha numeric.',
  })
  @ApiBody({
    required: true,
    schema: {
      example: {
        arrivalTimes: ['10:00', '14:33', '17:42'],
      },
    },
    description: `The daily schedule of that train. Must be in military time. Assumes each day the train has the same schedule, regardless of holidays`,
  })
  @Post(':trainLine/schedule')
  async createTrainLineSchedule(
    @Param() { trainLine }: CreateTrainLineScheduleParamDTO,
    @Body() { arrivalTimes }: CreateTrainLineScheduleBodyDTO,
  ): Promise<void> {
    await this.appService.createTrainSchedule(trainLine, arrivalTimes);
    return null;
  }
}
