import { IAction } from '../../core/interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class PlanInfo extends Document {
  @Prop()
  cur_active_plan_id: string;

  @Prop()
  personal_plans: string[];
}

const PlanInfoSchema = SchemaFactory.createForClass(PlanInfo);

@Schema()
export class TrainInfo extends Document {
  @Prop()
  personal_train_boilerplate: string[];

  @Prop()
  personal_train_actions: string[];
}
const TrainInfoSchema = SchemaFactory.createForClass(TrainInfo);

@Schema({ id: false })
export class User extends Document {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  pass_word: string;
  @Prop()
  salt: string;
  @Prop()
  avatar_url: string;
  @Prop({ type: TrainInfoSchema })
  train_info: TrainInfo;
  @Prop({ type: PlanInfoSchema })
  plan_info: Array<IAction>;
  async validatePassword(password: string): Promise<boolean> {
    return (await bcrypt.hash(password, this.salt)) === this.pass_word;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
