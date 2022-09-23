import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IPlan, ISchedule } from 'src/core/interface';
import { TrainItem, TrainItemSchema, User } from './user.schema';

@Schema()
export class Schedule implements Schedule {
  _id: string;
  @Prop()
  date: number;
  @Prop()
  is_giving_up: boolean;
  @Prop()
  snap_card_id: string;
  @Prop()
  snap_card_name: string;
  @Prop({ type: [TrainItemSchema], default: [] })
  // s-todo: 写库逻辑
  action_list: TrainItem[];
}

export const scheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema()
export class Plan implements Omit<Plan, 'user_id'> {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
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
  schedules: ISchedule[];
}
export type PlanDocument = IPlan & Document;

export const PlanSchema = SchemaFactory.createForClass(Plan);
