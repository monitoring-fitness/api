import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrainingTemplate, User, UserDocument } from 'src/schema/user.schema';
import { disconnect, Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { DailyLife, Plan } from '../../schema/plan.schema';
import { CreatePlanDto } from './dto/createPlan.dto';
import { DailyWorkOutStatus } from '../../core/interface';
import { test_id } from '../train/train.service';
import { PlanCode } from '../../domain/business-code';

// S-TODO: 找个合适的地方存放 ...
const getBetweenDaysUnix = (
  upperBound = dayjs().unix(),
  lowerBound: number,
): number[] => {
  const betweenDaysUnix: number[] = [];
  let currDayUnix = upperBound;
  while (currDayUnix < lowerBound) {
    console.log(dayjs.unix(currDayUnix).format('YYYY-MM-DD'));
    betweenDaysUnix.push(currDayUnix);
    currDayUnix = dayjs.unix(currDayUnix).add(1, 'day').unix();
  }
  return betweenDaysUnix;
};

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Plan.name) private planModel: Model<Plan>,
  ) {}
  // async adjustOneTrainCard(dto: AdjustDailyTrainDto) {
  //   const data = await this.planModel.findById(dto.plan_id);
  //
  //   const targetDailyIdx = data.schedules.findIndex(
  //     (i) => i._id.toString() === dto.daily_id,
  //   );
  //
  //   // s-todo: 可能存在问题
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   data.schedules[targetDailyIdx]?.action_list = dto.train_program;
  //
  //   return this.planModel.findByIdAndUpdate(dto.plan_id, data);
  // }
  //
  // async giveUpOneDay(dto: GiveUpOneDayDto) {
  //   const data = await this.planModel.findById(dto.plan_id);
  //
  //   const targetDailyIdx = data.schedules.findIndex(
  //     (i) => i._id.toString() === dto.daily_id,
  //   );
  //
  //   data.schedules[targetDailyIdx].is_giving_up = true;
  //
  //   return this.planModel.findByIdAndUpdate(dto.plan_id, data);
  // }
  //
  // async rerank(dto: RerankCalendarDto) {
  //   const data = await this.planModel.findById(dto._id);
  //
  //   dto.changed_daily_list.forEach(({ _id, new_date }) => {
  //     const idx = data.schedules.findIndex((schedule) => {
  //       return schedule._id.toString() === _id;
  //     });
  //     data.schedules[idx].perform_date = dayjs(new_date).unix();
  //   });
  //   // S-TODO: 可以不loading 到内存实现更新操作吗？
  //   return this.planModel.findByIdAndUpdate(dto._id, data);
  // }

  // 搞一个user的中间件？
  // s-todo: 如何将 userRecord 持久化到一个全局的地方呢？方便所有地方读取！
  async fetchToPerformWorkingLives(timeStamp: number[]): Promise<DailyLife[]> {
    const userRecord = await this.userModel.findById(test_id).exec();
    const activePlanId = userRecord.cur_active_plan_id;

    // find the plan
    const plan = await this.planModel.findById(activePlanId).exec();

    // find the daily life
    return timeStamp.reduce((memo, curTimestamp) => {
      const daily = plan.daily_life.find(
        (i) => i.to_perform_date === curTimestamp,
      );
      if (daily) {
        memo.push(daily);
      }
      return memo;
    }, []);
  }

  async cretePlan(createPlanDto: CreatePlanDto) {
    const isExited = await this.planModel.exists({
      user_id: test_id,
      name: createPlanDto.name,
    });

    if (isExited) {
      throw PlanCode.isExist;
    }

    const userRecord = await this.userModel.findById(test_id).exec();

    // 查询当前训练计划所引用的训练卡片
    const templates = createPlanDto.week_cycle_template_id.map((id) =>
      userRecord.training_templates.find((i) => i._id === id),
    );

    const planEntity = await this.generatorPlan(createPlanDto, templates);

    // s-mark: 如何存库失败了，怎么办？ try catch 如何通用处理呢？
    await this.planModel.create(planEntity);
  }

  private async generatorPlan(
    planDto: CreatePlanDto,
    referenceTemplates: TrainingTemplate[],
  ): Promise<Plan> {
    // 生成每天的训练内容
    let startStamp = planDto.start_time;
    const endStamp = planDto.end_time;
    let currTemplateIdx = 0;
    const dailyLife: DailyLife[] = [];

    while (startStamp < endStamp) {
      dailyLife.push({
        status: DailyWorkOutStatus.NotStart,
        to_perform_date: startStamp,
        completed_date: -1,
        snap_card_id: referenceTemplates[currTemplateIdx]._id,
        schedule: referenceTemplates[currTemplateIdx].schedule,
      });
      currTemplateIdx = (currTemplateIdx + 1) % referenceTemplates.length;
      startStamp = dayjs(startStamp).add(1, 'day').unix();
    }

    return {
      user_id: test_id,
      name: planDto.name,
      memo: planDto.memo,
      daily_life: dailyLife,
      create_time: dayjs().unix(),
      start_time: planDto.start_time,
      end_time: planDto.end_time,
    };
  }
}
