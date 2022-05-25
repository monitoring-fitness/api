import { TrainCardModule } from './module/train-card/train-card.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './module/auth/auth.module';
// CONTINUE: mongoURL 抽到env中
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:operation_admin_123@49.232.169.249:27017/operation',
    ),
    TrainCardModule,
    AuthModule,
  ],
})
export class AppModule {}
