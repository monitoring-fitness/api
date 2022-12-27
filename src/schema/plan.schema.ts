import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Action, ActionSchema, User } from './user.schema';
import { DailyWorkOutStatus } from '../core/interface';

@Schema({ _id: false })
export class DailyLife {
  @Prop()
  status: DailyWorkOutStatus;
  @Prop()
  completed_date: number;
  @Prop()
  to_perform_date: number;
  @Prop()
  snap_card_id: number;
  @Prop({ type: [ActionSchema], default: [] })
  schedule: Array<Action>;
}

export const DailyLifeSchema = SchemaFactory.createForClass(DailyLife);

@Schema({ id: false })
export class Plan {
  @Prop()
  id: string;
  // s-todo: 这种写法是为了什么？
  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: () => User })
  // user_id?: User | string;
  @Prop()
  user_id?: string;
  @Prop()
  name: string;
  @Prop()
  memo: string;
  @Prop({ type: [DailyLifeSchema], default: [] })
  daily_life: Array<DailyLife>;
  @Prop()
  create_time: number;
  @Prop()
  start_time?: number;
  @Prop()
  end_time?: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
