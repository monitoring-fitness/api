import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/domain/schema/user.schema';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { DailyLife, Plan } from '../../domain/schema/plan.schema';
import { CreatePlanDto } from '../../core/dto/plan/create-plan.dto';
import { DailyWorkOutStatus } from '../../core/interface';

const test_id = 'cbae08ef-d132-4b7a-b0c0-0f6fed6cb437';

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

  async crete(createPlanDto: CreatePlanDto) {
    //  1. 检查当前用户是否拥有同名计划
    const curUserPlans = await this.planModel
      .findOne({
        user_id: test_id,
        name: createPlanDto.name,
      })
      .exec();
    if (curUserPlans) {
      return new Error('当前用户已经存在同名计划');
    }
    //  2. 根据训练卡片快照id 填充所有未来日历
    const planEntity = await this.reduceCardToPlanCalendar(createPlanDto);
    //  3. 入库
    try {
      await this.planModel.create(planEntity);
    } catch (e) {
      console.error(e);
    }
  }

  // async getAll() {
  //   const testPlanId = '62a15e24faab15092d60e938';
  //   return await (await this.planModel.findById(testPlanId)).toJSON();
  // }

  /**
   * 生成训练日历
   * @private
   */
  private async reduceCardToPlanCalendar(
    planDto: CreatePlanDto,
  ): Promise<Plan> {
    const userRecord = await this.userModel.findById(test_id).exec();

    // 查询当前训练计划所引用的训练卡片
    const templates = planDto.week_cycle_template_id.map((id) =>
      userRecord.training_templates.find((i) => i._id === id),
    );

    // 生成每天的训练内容
    let currentDay = planDto.start_time;
    let currentTemplate = 0;
    const dailyLife: DailyLife[] = [];

    while (currentDay < planDto.end_time) {
      dailyLife.push({
        status: DailyWorkOutStatus.NotStart,
        to_perform_date: currentDay,
        completed_date: -1,
        snap_card_id: templates[currentTemplate]._id,
        action_list: templates[currentTemplate].schedule,
      });

      currentTemplate = (currentTemplate + 1) % templates.length;
      currentDay = dayjs(currentDay).add(1, 'day').unix();
    }

    return {
      user_id: test_id,
      name: planDto.name,
      memo: planDto.memo,
      daily_life: dailyLife,
      create_time: dayjs().unix(),
      complete_time: planDto.complete_time,
      start_time: planDto.start_time,
      end_time: planDto.end_time,
    };
  }
}
