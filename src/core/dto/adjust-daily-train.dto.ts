import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TrainProgramDto } from './create-train.dto';

export class AdjustDailyTrainDto {
  @IsString()
  @IsNotEmpty()
  plan_id: string;
  @IsString()
  @IsNotEmpty()
  daily_id: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TrainProgramDto)
  train_program: TrainProgramDto[];
}
