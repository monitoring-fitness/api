import { IsNotEmpty, IsString } from 'class-validator';

export class GiveUpOneDayDto {
  @IsString()
  @IsNotEmpty()
  plan_id: string;
  @IsString()
  @IsNotEmpty()
  daily_id: string;
}
