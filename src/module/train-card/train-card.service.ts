import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/domain/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class TrainCardService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async crete(createTrainCardDto: any): Promise<User> {
        const createTrainCard = await this.userModel.create(createTrainCardDto)
        return createTrainCard
    }

    async getAll() {
        return this.userModel.find().exec()
    }
}
