import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class PlanInfo extends Document {
  @Prop()
  cur_active_plan_id: string;

  @Prop()
  personal_plans: string[];
}

const PlanInfoSchema = SchemaFactory.createForClass(PlanInfo);

@Schema({ _id: false })
export class TrainInfo extends Document {
  @Prop()
  personal_train_boilerplate: string[];
  @Prop()
  personal_train_actions: string[];
}
const TrainInfoSchema = SchemaFactory.createForClass(TrainInfo);

@Schema()
export class User extends Document {
  @Prop()
  _id: string;
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  pass_word: string;
  @Prop()
  avatar_url: string;
  @Prop({
    type: TrainInfoSchema,
    default: {
      personal_train_boilerplate: [],
      personal_train_actions: [],
    },
  })
  train_info: TrainInfo;
  @Prop({
    type: PlanInfoSchema,
    default: {
      cur_active_plan_id: '',
      personal_plans: [],
    },
  })
  plan_info: PlanInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
