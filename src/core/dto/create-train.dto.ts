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
  ITrainItem,
  TrainType,
  WeightUnit,
} from 'src/core/interface/train-card.interface';

export class TrainItemExecuteInfoDto implements TrainItemExecuteInfoDto {
  @IsNumber()
  @Min(5)
  @Max(500)
  weight: number; // 重量
  @IsEnum(WeightUnit)
  weight_unit: WeightUnit; // 重量单位
  @IsNumber()
  @Min(1)
  @Max(50)
  repeat_num: number; // 重复次数
  @Min(1)
  @Max(10)
  group_num: number; // 组数
}

export class TrainProgramDto implements ITrainItem {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEnum(TrainType)
  type: TrainType;
  @ValidateNested({ each: true })
  @Type(() => TrainItemExecuteInfoDto)
  execute_info: TrainItemExecuteInfoDto;
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
  uid: string; // S-TODO: 如果有jwt鉴权逻辑了，还需要传uid？
}
