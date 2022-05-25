import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/domain/schema/user.schema';
import { TrainCardController } from './train-card.controller';
import { TrainCardService } from './train-card.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TrainCardController],
  providers: [TrainCardService],
})
export class TrainCardModule {}
