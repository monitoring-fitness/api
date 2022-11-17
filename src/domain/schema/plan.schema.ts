import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ActionSchema, User } from './user.schema';
import { Plan, Schedule } from '../../core/interface/plan';

@Schema()
export class SSchedule implements Schedule {
  _id: string;
  @Prop()
  date: number;
  @Prop()
  complete_date: number;
  @Prop()
  to_perform_date: number;
  @Prop()
  is_giving_up: boolean;
  @Prop()
  snap_card_id: string;
  @Prop()
  snap_card_name: string;
  @Prop({ type: [ActionSchema], default: [] })
  // s-todo: 写库逻辑
  action_list: [];
}

export const scheduleSchema = SchemaFactory.createForClass(SSchedule);

@Schema()
export class SPlan implements Omit<Plan, 'user_id'> {
  // s-todo: 为什么这里要使用ref来引用一下呢？
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: () => User })
  user_id?: User | string;
  @Prop()
  create_time?: number;
  @Prop()
  start_time: number;
  @Prop()
  end_time: number;
  @Prop()
  complete_time?: number;
  @Prop()
  name: string;
  @Prop()
  explain: string;
  @Prop({ type: [scheduleSchema], default: [] })
  schedules: [];
}

export const PlanSchema = SchemaFactory.createForClass(SPlan);
