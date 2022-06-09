import { PlanService } from './plan.service';
import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { HTTPResponse } from 'src/util/HTTPResponse';
import { PlanCode, PlanCode2Message } from 'src/domain/business-code';
import { CreatePlanDto } from '../../core/dto/create-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}
  @Patch('give-up')
  /**
   * 放弃某一天训练
   */
  async giveUpOneDay() {
    return;
  }
  @Patch('replace')
  /**
   * 替换某一个训练卡片
   */
  async replaceOneTrainCard() {
    return;
  }
  @Patch('adjust')
  /**
   * 微调某一天的训练卡片
   */
  async adjustOneTrainCard() {
    return;
  }

  @Get()
  /**
   * 获取所有计划
   */
  async getAll() {
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
