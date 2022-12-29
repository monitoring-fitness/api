import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { DailyWorkOutStatus } from 'src/common/interface/train-basic.interface';
import { User } from 'src/auth/schema/user.schema';
import { Iuser } from 'src/auth/interface/user.interface';
import { TrainBoilerPlate } from 'src/train/schema/train-boilerplate.schema';
import { ITrainBoilerplate } from 'src/train/interface/train-boilerplate.interface';
import { PlanCode } from 'src/common/business-code';
import { CreatePlanDto } from './dto/create-plan.dto';
import { DailyLife, Plan } from './schema/plan.schema';
import { IPlan } from './interface/plan.interface';

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
    @InjectModel(User.name) private userModel: Model<Iuser>,
    @InjectModel(Plan.name) private planModel: Model<IPlan>,
    @InjectModel(TrainBoilerPlate.name)
    private trainBoilerPlateModel: Model<ITrainBoilerplate>,
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

  async getToPerformWorkingLives(timeStamp: number[], user: Iuser) {
    const plan = await this.planModel
      .findById(user.plan_info.cur_active_plan_id)
      .exec();

    return plan.daily_life.filter((daily) =>
      timeStamp.includes(daily.to_perform_date),
    );
  }

  async performPlan(planId: string, user: Iuser) {
    await this.userModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $set: {
          'plan_info.cur_active_plan_id': planId,
        },
      },
    );
  }

  async crete(createPlanDto: CreatePlanDto, user: Iuser) {
    if (
      await this.planModel.exists({
        user_id: user._id,
        name: createPlanDto.name,
      })
    ) {
      throw PlanCode.isExist;
    }

    // 查询当前训练计划所引用的训练卡片
    const boilerplate = await this.trainBoilerPlateModel
      .find()
      .where('_id')
      .in(createPlanDto.week_cycle_boilerplate_ids)
      .sort({ _id: 1 }) // s-todo: 如何让这个排序，是按照 week_cycle_boilerplate_ids 的顺序来的？
      .exec();

    const plan = await this.planModel.create(
      this.generatorPlan(createPlanDto, boilerplate, user),
    );

    await this.userModel.updateOne(
      { _id: user._id },
      {
        // s-continue: 属性访问式更新，能行吗？
        $set: {
          'train_info.personal_plans': [plan._id],
        },
      },
    );
  }

  private generatorPlan(
    planDto: CreatePlanDto,
    referenceTemplates: TrainBoilerPlate[],
    user: Iuser,
  ) {
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
        snap_train_boilerplate_id: referenceTemplates[currTemplateIdx]._id,
        schedule: referenceTemplates[currTemplateIdx].schedule,
      });
      currTemplateIdx = (currTemplateIdx + 1) % referenceTemplates.length;
      startStamp = dayjs.unix(startStamp).add(1, 'day').unix();
    }

    return {
      user_id: user._id,
      name: planDto.name,
      intro: planDto.intro,
      daily_life: dailyLife,
      create_time: dayjs().unix(),
      start_time: planDto.start_time,
      end_time: planDto.end_time,
    };
  }

  async getAll(user: Iuser) {
    return this.planModel.find({ user_id: user._id }).exec();
  }
}
