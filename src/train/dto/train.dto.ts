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
