import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { DailyWorkOutStatus } from 'src/common/interface/train-basic.interface';
import {
  Action,
  ActionSchema,
  TrainBoilerPlate,
} from 'src/train/schema/train-boilerplate.schema';

@Schema({ _id: true })
export class DailyLife {
  @Prop()
  status: DailyWorkOutStatus;
  @Prop()
  completed_date: number;
  @Prop()
  to_perform_date: number;
  @Prop({ type: SchemaTypes.ObjectId, ref: TrainBoilerPlate.name })
  snap_train_boilerplate_id: Types.ObjectId;
  @Prop({ type: [ActionSchema], default: [] })
  schedule: Array<Action>;
}

export const DailyLifeSchema = SchemaFactory.createForClass(DailyLife);

@Schema({ id: true, versionKey: false })
export class Plan {
  @Prop()
  user_id?: string;
  @Prop()
  name: string;
  @Prop()
  intro: string;
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
