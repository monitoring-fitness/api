import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { User } from 'src/auth/schema/user.schema';
import { Iuser } from 'src/auth/interface/user.interface';
import { ResponseError } from 'src/common/dto/response.dto';
import { ActionType } from 'src/common/interface/train-basic.interface';
import {
  ActionDto,
  CreateTrainBoilerplateDto,
} from './dto/create-train-boilerplate.dto';
import { TrainBoilerPlate } from './schema/train-boilerplate.schema';

@Injectable()
export class TrainBoilerplateService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TrainBoilerPlate.name)
    private trainBoilerPlateModel: Model<TrainBoilerPlate>,
  ) {}

  async getAll(user: Iuser) {
    const trainBoilerPlates = await this.trainBoilerPlateModel.find().exec();
    return trainBoilerPlates.map((b) => b.toJSON());
  }

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

    const trainBoilerplate = await this.trainBoilerPlateModel.create({
      ...boilerplate,
      schedule: genTrainBoilerPlateSchedule(boilerplate.schedule),
      create_author_id: user._id,
      create_time: dayjs().unix(),
      update_time: dayjs().unix(),
    });

    await this.userModel.updateOne(
      { _id: user._id },
      {
        train_info: {
          personal_train_boilerplate: [
            ...user.train_info.personal_train_boilerplate,
            trainBoilerplate._id,
          ],
        },
      },
    );
  }
}
