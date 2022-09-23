import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';
import {
  ITrainCard,
  TrainProgram,
  BodyScope,
  WeightUnit,
} from 'src/core/interface/';

export class TrainProgramDto implements TrainProgram {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEnum(BodyScope)
  body_scope: BodyScope;
  @Min(1)
  @Max(10)
  group_count: number; // 组数
  @IsEnum(WeightUnit)
  weight_unit: WeightUnit; // 重量单位
  @IsNumber()
  @Min(1)
  @Max(50)
  default_repeat: number; // 重复次数
  @IsNumber()
  @Min(5)
  @Max(500)
  default_weight: number; // 重量
}

export class CreateTrainDto implements ITrainCard {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  memo: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TrainProgramDto)
  train_program: TrainProgramDto[];
}
