import { TrainBoilerplateModule } from './train/train-boilerplate.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PlanModule } from './plan/plan.module';

// s-continue: post plan error
// s-todo: mongoURL 抽到env中
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:operation_admin_123@49.232.169.249:27017/operation',
    ),
    AuthModule,
    TrainBoilerplateModule,
    PlanModule,
  ],
})
export class AppModule {}
