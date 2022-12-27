import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Plan, PlanSchema } from '../../schema/plan.schema';
import { User, UserSchema } from '../../schema/user.schema';

@Module({
  imports: [
    // S-TODO: 如果service里面要用多个schema，这里还需要注册一下吗？
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
