import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/domain/schema/user.schema';
import { Model } from 'mongoose';
import { CreateTrainDto } from 'src/core/dto';
import { PlanCode } from 'src/domain/business-code';
import { ITrainCard } from 'src/core/interface';
import * as dayjs from 'dayjs';

const test_id = '628cede68a7254c614b2d563';
@Injectable()
export class TrainCardService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async crete(createTrainCardDto: CreateTrainDto): Promise<CreateTrainDto> {
    // Note: about operation append to array ：https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose

    const userInfo = await this.userModel.findById(test_id);
    if (
      userInfo.default_cards.findIndex(
        (card) => card.name === createTrainCardDto.name,
      ) !== -1
    ) {
      throw PlanCode.isExist;
    }

    console.log(dayjs());

    const trainCard: ITrainCard = {
      ...createTrainCardDto,
      create_time: dayjs().unix(),
    };
    userInfo.default_cards.push(trainCard);

    await this.userModel.findByIdAndUpdate(test_id, userInfo);

    return createTrainCardDto;
  }

  async getAll() {
    return (await this.userModel.findById(test_id)).default_cards;
  }
}
