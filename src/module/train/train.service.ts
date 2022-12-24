import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { PlanCode } from '../../domain/business-code/plan';
import * as dayjs from 'dayjs';
import { CreateTrainingTemplateDto } from '../../core/dto/';
import { TrainingTemplate, User } from '../../domain/schema/user.schema';
import { ActionType } from '../../core/interface';

const test_id = 'cbae08ef-d132-4b7a-b0c0-0f6fed6cb437';

// s-todo: how to manager the error logic?

@Injectable()
export class TrainService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // async createPrivateAction(dto: CreatePrivateActionDto): Promise<boolean> {
  //   const userInfo = await this.userModel.findById(test_id);
  //
  // }

  async createTrainCardTemplate(
    createTrainingCardDto: CreateTrainingTemplateDto,
  ): Promise<boolean> {
    // Note: about operation append to array ：https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose
    const user = await this.userModel.findById(test_id);

    if (
      user.training_templates.findIndex(
        (training) => training.name === createTrainingCardDto.name,
      ) !== -1
    ) {
      // throw PlanCode.isExist;
      return;
    }

    const trainCardTemplate: TrainingTemplate = {
      ...createTrainingCardDto,
      _id: dayjs().unix(),
      create_time: dayjs().unix(),
      update_time: dayjs().unix(),
      schedule: createTrainingCardDto.schedule.map((action) => ({
        name: action.name,
        weight_unit: action.weight_unit,
        set_list: new Array(action.group_count)
          .fill({
            type: ActionType['warn-up'],
            weight: action.default_weight,
            count: action.default_repeat_time,
            rpe: action.default_rpe,
          })
          .map((action, index) => ({ ...action, order: index + 1 })),
      })),
    };
    console.log(trainCardTemplate);
    user.training_templates.push(trainCardTemplate);

    await this.userModel.findByIdAndUpdate(test_id, user);

    return true;
  }

  // async getAll() {
  //   return (await this.userModel.findById(test_id)).default_cards;
  // }
}
