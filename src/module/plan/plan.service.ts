import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/domain/schema/user.schema';
import { Model } from 'mongoose';
import { CreatePlanDto } from '../../core/dto/create-plan.dto';
import { IPlan, ISchedule, ITrainCard } from '../../core/interface';
import * as dayjs from 'dayjs';
import { RerankCalendarDto } from '../../core/dto/rerank-calendar.dto';
import { GiveUpOneDayDto } from '../../core/dto/giveUp-oneDay.dto';
import { AdjustDailyTrainDto } from '../../core/dto/adjust-daily-train.dto';
import { Plan } from '../../domain/schema/plan.schema';

const test_id = '628cede68a7254c614b2d563';
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
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Plan.name) private planModel: Model<Plan>,
  ) {}
  async adjustOneTrainCard(dto: AdjustDailyTrainDto) {
    const data = await this.planModel.findById(dto.plan_id);

    const targetDailyIdx = data.schedules.findIndex(
      (i) => i._id.toString() === dto.daily_id,
    );

    // s-todo: 可能存在问题
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.schedules[targetDailyIdx]?.action_list = dto.train_program;

    return this.planModel.findByIdAndUpdate(dto.plan_id, data);
  }

  async giveUpOneDay(dto: GiveUpOneDayDto) {
    const data = await this.planModel.findById(dto.plan_id);

    const targetDailyIdx = data.schedules.findIndex(
      (i) => i._id.toString() === dto.daily_id,
    );

    data.schedules[targetDailyIdx].is_giving_up = true;

    return this.planModel.findByIdAndUpdate(dto.plan_id, data);
  }

  async rerank(dto: RerankCalendarDto) {
    const data = await this.planModel.findById(dto._id);

    dto.changed_daily_list.forEach(({ _id, new_date }) => {
      const idx = data.schedules.findIndex((schedule) => {
        return schedule._id.toString() === _id;
      });
      data.schedules[idx].perform_date = dayjs(new_date).unix();
    });
    // S-TODO: 可以不loading 到内存实现更新操作吗？
    return this.planModel.findByIdAndUpdate(dto._id, data);
  }

  async crete(createPlanDto: CreatePlanDto) {
    //  1. 检查当前用户是否拥有同名计划
    const curUserPlans = await this.planModel
      .findOne({
        user_id: test_id,
        name: createPlanDto.name,
      })
      .exec();
    if (curUserPlans) {
      return '重复';
    }
    //  2. 生成基础日期属性
    //  3. 根据训练卡片快照id 填充所有未来日历
    const planEntity = await this.reduceCardToPlanCalendar(createPlanDto);
    //  4. 入库
    try {
      const createAns = await this.planModel.create(planEntity);
      if (createAns) {
        // S-TODO: 更新用户当前正在执行的计划。
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getAll() {
    const testPlanId = '62a15e24faab15092d60e938';
    return await (await this.planModel.findById(testPlanId)).toJSON();
  }

  /**
   * 生成训练日历
   * @private
   */
  private async reduceCardToPlanCalendar(
    planDto: CreatePlanDto & Partial<IPlan>,
  ): Promise<IPlan> {
    const userRecord = await this.userModel.findById(test_id).exec();

    const start_time = dayjs().add(1, 'day').unix();
    const end_time = dayjs
      .unix(start_time)
      .add(planDto.duration, 'week')
      .unix();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const schedules: ISchedule[] = getBetweenDaysUnix(start_time, end_time).map(
      (everyDay, index) => {
        const shouldUseCardId =
          planDto.trainCardsId[index % planDto.trainCardsId.length];

        const cardEntity: ITrainCard = userRecord.default_cards.find((item) => {
          return item._id.toString() === shouldUseCardId;
        });

        return {
          is_giving_up: false,
          complete_date: -1,
          perform_date: everyDay,
          snap_card_id: cardEntity._id,
          snap_card_name: cardEntity.name,
          // s-todo: 这里的训练卡片，需要填充具体的default 内容
          action_list: cardEntity.train_program,
        };
      },
    );

    return {
      name: planDto.name,
      user_id: test_id,
      explain: planDto.explain,
      create_time: start_time,
      start_time,
      end_time,
      schedules: schedules,
    };
  }
}
