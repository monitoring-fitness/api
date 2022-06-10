import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChangedDailyInfo {
  @IsString()
  @IsNotEmpty()
  _id: string;
  @IsString()
  @IsNotEmpty()
  new_date: string; // 调整后的新日期
}

export class RerankCalendarDto {
  @IsString()
  @IsNotEmpty()
  _id: string; // plan 的id
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ChangedDailyInfo)
  changed_daily_list: Array<ChangedDailyInfo>;
}
