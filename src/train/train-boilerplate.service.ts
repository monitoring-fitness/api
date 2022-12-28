import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { ActionDto } from '../core/dto';
import { TrainingTemplate } from '../schema/user.schema';
import { ActionType } from '../core/interface';
import { PlanCode } from '../common/business-code';
import { User } from 'src/auth/schema/user.schema';
import { Iuser } from 'src/auth/interface/user.interface';
import { CreateTrainBoilerplateDto } from './dto/create-train-boilerplate.dto';

export const test_id = 'cbae08ef-d132-4b7a-b0c0-0f6fed6cb437';

@Injectable()
export class TrainBoilerplateService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // async createPrivateAction(dto: CreatePrivateActionDto): Promise<boolean> {
  //   const userInfo = await this.userModel.findById(test_id);
  //
  // }

  async getAll() {
    const user = await this.userModel.findById(test_id);
    return null;
  }

  // 有了鉴权API和守卫，就直接取user用就好了，很方便！
  // s-continue: 重构create 方法

  async create(
    boilerplate: CreateTrainBoilerplateDto,
    user: Iuser,
  ): Promise<void> {
    // const genTrainingSchedule = (actionDto: ActionDto[]) =>
    //   actionDto.map((action) => ({
    //     name: action.name,
    //     weight_unit: action.weight_unit,
    //     set_list: new Array(action.group_count)
    //       .fill({
    //         type: ActionType['formal'],
    //         weight: action.default_weight,
    //         count: action.default_repeat_time,
    //         rpe: action.default_rpe,
    //       })
    //       .map((setInfo, index) => ({ ...setInfo, order: index + 1 })),
    //   }));
    //
    // const user = await this.userModel.findById(test_id); // Note: about operation append to array ：https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose
    //
    // if (
    //   user.training_templates.findIndex(
    //     (training) => training.name === createTrainingCardDto.name,
    //   ) !== -1
    // ) {
    //   // s-todo: Code 应该使用Train的，而不是plan
    //   throw PlanCode.isExist;
    // }
    //
    // const trainCardTemplate: TrainingTemplate = {
    //   schedule: genTrainingSchedule(createTrainingCardDto.schedule),
    //   ...boilerplate,
    //   _id: dayjs().unix(),
    //   create_time: dayjs().unix(),
    //   update_time: dayjs().unix(),
    // };
    //
    // user.training_templates.push(trainCardTemplate);
    //
    // await this.userModel.findByIdAndUpdate(test_id, user);
  }

  // async getAll() {
  //   return (await this.userModel.findById(test_id)).default_cards;
  // }
}
