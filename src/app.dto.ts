import {
  IsArray,
  IsDefined,
  IsAlphanumeric,
  MinLength,
  MaxLength,
  IsMilitaryTime,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

export class CreateTrainLineScheduleParamDTO {
  @IsDefined()
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(4)
  trainLine: string;
}

export class CreateTrainLineScheduleBodyDTO {
  // went with military time to prevent parsing of am/pm
  // capped a max of 20 arrivals to prevent large scale input/train abuse
  @IsDefined()
  @IsArray()
  @IsMilitaryTime({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  arrivalTimes: string[];
}

export class FindTrainArrivalIntersectionQueryDTO {
  @IsDefined()
  @IsMilitaryTime()
  arrivalTime: string;
}
