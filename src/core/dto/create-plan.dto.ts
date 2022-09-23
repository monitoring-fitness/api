import {
  ValidateNested,
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { IPlan, ISchedule } from '../interface';

export class CreatePlanDto
  implements Pick<IPlan, 'name' | 'explain' | 'duration'>
{
  @IsNumber()
  @IsNotEmpty()
  duration: number; // 先写死8周训练
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  explain: string;
  trainCardsId: string[];
}
