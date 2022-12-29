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
  name: string;
  @IsString()
  @IsNotEmpty()
  intro: string;
  @IsNumber()
  @IsNotEmpty()
  start_time: number;
  @IsNumber()
  @IsNotEmpty()
  end_time: number;
  @IsArray()
  @ArrayNotEmpty()
  week_cycle_boilerplate_ids: string[];
}
