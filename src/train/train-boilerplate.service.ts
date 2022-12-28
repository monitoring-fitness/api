import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { TrainingTemplate } from '../schema/user.schema';
import { ActionType } from '../core/interface';
import { PlanCode } from '../common/business-code';
import { User } from 'src/auth/schema/user.schema';
import { Iuser } from 'src/auth/interface/user.interface';
import {
  ActionDto,
  CreateTrainBoilerplateDto,
} from './dto/create-train-boilerplate.dto';
import { TrainBoilerPlate } from './schema/train-boilerplate.schema';
import { ResponseError } from '../common/dto/response.dto';

export const test_id = 'cbae08ef-d132-4b7a-b0c0-0f6fed6cb437';

@Injectable()
export class TrainBoilerplateService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TrainBoilerPlate.name)
    private trainBoilerPlateModel: Model<TrainBoilerPlate>,
  ) {}

  // async createPrivateAction(dto: CreatePrivateActionDto): Promise<boolean> {
  //   const userInfo = await this.userModel.findById(test_id);
  //
  // }

  async getAll() {
    const user = await this.userModel.findById(test_id);
    return null;
  }

  // s-continue:
  /**
   *
   * 看看 用了MongoDB的那个项目
   *
   */
  async create(boilerplate: CreateTrainBoilerplateDto, user: Iuser) {
    // 1. 检查是否存在同一用户下的同名模板
    const exist = await this.trainBoilerPlateModel.findOne({
      name: boilerplate.name,
      create_author_id: user._id,
    });
    if (exist) {
      return new ResponseError('模板名已存在');
    }
    // 2. 创建模板
    const genTrainBoilerPlateSchedule = (actionDto: ActionDto[]) =>
      actionDto.map((action) => ({
        name: action.name,
        weight_unit: action.weight_unit,
        set_list: new Array(action.group_count)
          .fill({
            type: ActionType['formal'],
            weight: action.default_weight,
            count: action.default_repeat_time,
            rpe: action.default_rpe,
          })
          .map((setInfo, index) => ({ ...setInfo, order: index + 1 })),
      }));

    const trainBoilerplate = {
      schedule: genTrainBoilerPlateSchedule(boilerplate.schedule),
      ...boilerplate,
      _id: dayjs().unix(),
      create_time: dayjs().unix(),
      update_time: dayjs().unix(),
    };

    // s-todo: 如何处理MongoDB的Error？
    await this.userModel.updateOne(
      { _id: user._id },
      {
        train_info: {
          personal_train_temples: [
            ...user.train_info.personal_train_temples,
            trainBoilerplate,
          ],
        },
      },
    );
    await this.trainBoilerPlateModel.create(trainBoilerplate);
  }

  // async getAll() {
  //   return (await this.userModel.findById(test_id)).default_cards;
  // }
}
