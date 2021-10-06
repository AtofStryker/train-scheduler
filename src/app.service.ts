import { Injectable, Inject } from '@nestjs/common';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import pickBy from 'lodash/pickBy';
import parse from 'date-fns/parse';
import { RedisCacheService } from './cache/redisCache.service';

const ascendingSortComparator = (a, b) =>
  parse(a, 'HH:mm', new Date()).getTime() -
  parse(b, 'HH:mm', new Date()).getTime();

@Injectable()
export class AppService {
  constructor(
    private readonly redisCacheService: RedisCacheService, // REMEMBER TO INJECT THIS
  ) {}

  private async getTrainSchedules(): Promise<string[][]> {
    const registeredTrains = await this.redisCacheService.keys();

    const schedules = await Promise.all(
      registeredTrains.map(async (registeredTrain) =>
        this.redisCacheService.fetch(registeredTrain),
      ),
    );

    return schedules;
  }

  private findClosestRemainingTrainIntersectionalArrivalTime(
    trainSchedules: string[][],
    arrivalTime: string,
  ): string | null {
    // based on the current schedule, get what our arrival time is
    const currentDate = parse(arrivalTime, 'HH:mm', new Date());

    // then, filter out the train arrivals that have already occured
    const trainSchedulesWithRemainingArrivals = trainSchedules.map(
      (trainSchedule) => {
        return trainSchedule.filter((arrivalTime) => {
          return (
            parse(arrivalTime, 'HH:mm', new Date()).getTime() >=
            currentDate.getTime()
          );
        });
      },
    );

    // then find the earliest intersection!
    return this.findIntersectionsInTrainSchedule(
      trainSchedulesWithRemainingArrivals,
    );
  }

  private findIntersectionsInTrainSchedule(
    schedule: string[][],
  ): string | null {
    // merge all the schedules together
    const allSchedulesMergedTogether = flatten(schedule);

    // and find where there are duplicated
    const allIntersectionalArrivalsLeft = pickBy(
      groupBy(allSchedulesMergedTogether),
      (x) => x.length > 1,
    );

    // then sort the array and get the earliest one (a hashset would be very useful here...)
    const closestIntersectionalArrivalTime = Object.keys(
      allIntersectionalArrivalsLeft,
    ).sort(ascendingSortComparator)[0];

    return closestIntersectionalArrivalTime || null;
  }

  async createTrainSchedule(
    trainLine: string,
    arrivals: string[],
  ): Promise<void> {
    // before inserting the schedule, we should sort it from earliest to latest
    // create a fresh array to prevent side effects and keep a first order function
    const sortedArrivals = [...arrivals].sort(ascendingSortComparator);

    await this.redisCacheService.set(trainLine, sortedArrivals);
    return undefined;
  }

  async findTrainScheduleIntersection(
    arrivalTime: string,
  ): Promise<string | null> {
    // first, get all of our train schedules. We do not care which train the schedule belongs to
    // assume all records are already sorted on insert
    const trainSchedules = await this.getTrainSchedules();

    const closestRemainingTrainIntersectionalArrivalTime =
      this.findClosestRemainingTrainIntersectionalArrivalTime(
        trainSchedules,
        arrivalTime,
      );

    if (closestRemainingTrainIntersectionalArrivalTime === null) {
      return this.findIntersectionsInTrainSchedule(trainSchedules) || null;
    }

    return closestRemainingTrainIntersectionalArrivalTime;
  }
}
