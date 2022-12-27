import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  BodyScope,
  ActionBasicInfo,
  ITrainingTemplate,
  IAction,
  WeightUnit,
} from '../../core/interface';
import { Type } from 'class-transformer';

export class ActionDto {
  // 用来定位当前具体的动作名称
  @IsString()
  @IsNotEmpty()
  name: string;
  @Min(1)
  @Max(10)
  group_count: number;
  @IsEnum(WeightUnit)
  weight_unit: WeightUnit;
  @IsNumber()
  @Min(1)
  @Max(50)
  default_repeat_time: number;
  @IsNumber()
  @Min(5)
  @Max(800)
  default_weight: number;
  @IsNumber()
  @Min(1)
  @Max(10)
  default_rpe: number;
}

export class CreateTrainingTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  memo: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ActionDto)
  schedule: Array<ActionDto>;
}

export class CreatePrivateActionDto implements Omit<ActionBasicInfo, '_id'> {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  introduction: string;
  @IsEnum(BodyScope)
  body_scope: BodyScope;
}
