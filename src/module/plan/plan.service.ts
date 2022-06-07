import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/domain/schema/user.schema';
import { Model } from 'mongoose';
import { CreatePlanDto } from '../../core/dto/create-plan.dto';
import { Plan } from '../../domain/schema/plan.schema';
import { IPlan, ISchedules, ITrainCard } from '../../core/interface';
import * as dayjs from 'dayjs';
import _ from 'lodash/fp';

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
  ) { }

  public async crete(createPlanDto: CreatePlanDto) {
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
    return await this.planModel.create(planEntity);
  }

  async getAll() {
    return (await this.userModel.findById(test_id)).default_cards;
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

    const schedules: ISchedules[] = getBetweenDaysUnix(
      start_time,
      end_time,
    ).map((everyDay, index) => {
      const shouldUseCardId =
        planDto.trainCards[index % planDto.trainCards.length];

      const cardEntity: ITrainCard = userRecord.default_cards.find((item) => {
        return item._id.toString() === shouldUseCardId;
      });

      return {
        date: everyDay,
        snap_card_id: cardEntity._id,
        is_giving_up_training: false,
        train_program: cardEntity.train_program,
      };
    });

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
