import { PlanService } from './plan.service';
import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { HTTPResponse } from 'src/util/HTTPResponse';
import { PlanCode, PlanCode2Message } from 'src/domain/business-code';
import { CreatePlanDto } from '../../core/dto/create-plan.dto';
import * as dayjs from 'dayjs';
import { RerankCalendarDto } from '../../core/dto/rerank-calendar.dto';
import { GiveUpOneDayDto } from '../../core/dto/giveUp-oneDay.dto';
import { AdjustDailyTrainDto } from '../../core/dto/adjust-daily-train.dto';
import { ReplaceOneTrainDto } from '../../core/dto/replace-one-train.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}
  @Patch('give-up')
  /**
   * 放弃某一天训练
   */
  async giveUpOneDay(@Body() dto: GiveUpOneDayDto) {
    return await this.planService.giveUpOneDay(dto);
  }

  // S-TODO: 需要一些mongose的技巧 ...
  @Patch('replace')
  /**
   * 替换某一个训练卡片
   */
  async replaceOneTrainCard(@Body() dto: ReplaceOneTrainDto) {
    return;
  }
  @Put('adjust')
  /**
   * 微调某一天的训练卡片
   */
  async adjustOneTrainCard(@Body() dto: AdjustDailyTrainDto) {
    return await this.planService.adjustOneTrainCard(dto);
  }
  @Patch()
  /**
   * 对日历进行重排操作
   */
  async reRankCalendar(@Body() dto: RerankCalendarDto) {
    return await this.planService.rerank(dto);
  }
  // S-TODO: 增加特定id注解,来标识要获取的plan
  @Get()
  /**
   * 获取一个指定计划
   */
  async getOnePlan() {
    const data = await this.planService.getAll();

    return data.schedules;
  }
  @Post() // Put 是幂等的，创建一个计划是非幂等操作（多次创建相同计划是拒绝的），要用POST请求。
  /**
   * 创建一个计划
   */
  async create(@Body() dto: CreatePlanDto) {
    try {
      const data = await this.planService.crete(dto);
      return data;
    } catch (error) {
      const code = error as PlanCode;
      return new HTTPResponse(code, PlanCode2Message[code], null);
    }
  }
}
