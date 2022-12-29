import { PlanService } from './plan.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { AuthGuard } from '@nestjs/passport';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Iuser } from '../auth/interface/user.interface';
import { User } from 'src/common/decorator/user.decorator';

@UseGuards(AuthGuard())
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}
  // @Patch('give-up')
  // /**
  //  * 放弃某一天训练
  //  */
  // async giveUpOneDay(@Body() dto: GiveUpOneDayDto) {
  //   return await this.planService.giveUpOneDay(dto);
  // }
  //
  // @Patch('replace')
  // /**
  //  * 替换某一个训练卡片
  //  */
  // async replaceOneTrainCard(@Body() dto: ReplaceOneTrainDto) {
  //   return;
  // }
  // @Put('adjust')
  // /**
  //  * 微调某一天的训练卡片
  //  */
  // async adjustOneTrainCard(@Body() dto: AdjustDailyTrainDto) {
  //   return await this.planService.adjustOneTrainCard(dto);
  // }
  // @Patch()
  // /**
  //  * 对日历进行重排操作
  //  */
  // async reRankCalendar(@Body() dto: RerankCalendarDto) {
  //   return await this.planService.rerank(dto);
  // }
  // @Get()
  // /**
  //  * 获取一个指定计划
  //  */
  // async getOnePlan() {
  //   const data = await this.planService.getAll();
  //
  //   return data.schedules;
  // }
  @Get('perform/:id')
  async performPlan(@Param('id') id: string, @User() user: Iuser) {
    return await this.planService.performPlan(id, user);
  }

  @Get('get/all')
  async getAll(@User() user: Iuser) {
    return await this.planService.getAll(user);
  }

  @Get('get/workout/today')
  async getTodayWorkout(@User() user: Iuser) {
    const lives = await this.planService.getToPerformWorkingLives(
      // [dayjs().unix()],
      [1672278531],
      user,
    );
    return lives?.[0];
  }

  @Post('create') // Put 是幂等的，创建一个计划是非幂等操作（多次创建相同计划是拒绝的），要用POST请求。
  async create(@Body() planDto: CreatePlanDto, @User() user: Iuser) {
    return await this.planService.crete(planDto, user);
  }
}
