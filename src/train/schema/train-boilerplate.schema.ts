import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ActionType,
  WeightUnit,
} from 'src/common/interface/train-basic.interface';
import { IAction } from '../interface/train-boilerplate.interface';

@Schema()
export class Action {
  @Prop()
  name: string;
  @Prop()
  weight_unit: WeightUnit;
  @Prop()
  set_list: Array<{
    rpe: number;
    order: number;
    weight: number;
    repeat: number;
    type: ActionType;
  }>;
}

export const ActionSchema = SchemaFactory.createForClass(Action);

@Schema({
  versionKey: false,
  _id: true,
})
export class TrainBoilerPlate extends Document {
  @Prop()
  name: string;
  @Prop()
  intro: string;
  @Prop()
  create_author_id: string;
  @Prop()
  create_time: number;
  @Prop()
  update_time: number;
  @Prop({ type: [ActionSchema] })
  schedule: IAction[];
}

export const TrainBoilerPlateSchema =
  SchemaFactory.createForClass(TrainBoilerPlate);
