import { TrainCardModule } from './module/train-card/train-card.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// CONTINUE: mongoURL 抽到env中
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:operation_admin_123@49.232.169.249:27017/operation',
    ),
    TrainCardModule,
  ],
})
export class AppModule {}
