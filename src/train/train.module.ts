import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TrainBoilerplateController } from './train-boilerplate.controller';
import { TrainBoilerplateService } from './train-boilerplate.service';
import { UserSchema, User } from '../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TrainBoilerplateController],
  providers: [TrainBoilerplateService],
})
export class TrainModule {}
