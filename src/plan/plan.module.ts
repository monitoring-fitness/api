import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import {
  TrainBoilerPlate,
  TrainBoilerPlateSchema,
} from 'src/train/schema/train-boilerplate.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Plan, PlanSchema } from './schema/plan.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: User.name, schema: UserSchema },
      { name: TrainBoilerPlate.name, schema: TrainBoilerPlateSchema },
    ]),
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
