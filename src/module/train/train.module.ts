import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';
import { UserSchema, User } from '../../domain/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TrainController],
  providers: [TrainService],
})
export class TrainModule {}
