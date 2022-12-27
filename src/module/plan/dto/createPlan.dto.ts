import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  memo: string;
  @IsNumber()
  @IsNotEmpty()
  start_time: number;
  @IsNumber()
  @IsNotEmpty()
  end_time: number;
  @IsArray()
  @ArrayNotEmpty()
  week_cycle_template_id: number[];
}
