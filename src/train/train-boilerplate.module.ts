import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TrainBoilerplateController } from './train-boilerplate.controller';
import { TrainBoilerplateService } from './train-boilerplate.service';
import { UserSchema, User } from '../schema/user.schema';
import {
  TrainBoilerPlate,
  TrainBoilerPlateSchema,
} from './schema/train-boilerplate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TrainBoilerPlate.name, schema: TrainBoilerPlateSchema },
    ]),
  ],
  controllers: [TrainBoilerplateController],
  providers: [TrainBoilerplateService],
})
export class TrainBoilerplateModule {}
