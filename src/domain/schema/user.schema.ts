import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IUserAuth,
  ITrainCard,
  TrainProgram,
  WeightUnit,
} from 'src/core/interface';
import * as bcrypt from 'bcrypt';

// NOTE: how to create nested json? https://github.com/nestjs/mongoose/issues/839
@Schema({ _id: false })
export class TrainItem implements TrainProgram {
  @Prop()
  name: string;
  @Prop()
  body_scope: number;
  @Prop()
  group_count: number;
  @Prop()
  weight_unit: WeightUnit;
  @Prop()
  default_weight: number;
  @Prop()
  default_repeat: number;
}

export const TrainItemSchema = SchemaFactory.createForClass(TrainItem);

@Schema()
export class DefaultCard implements ITrainCard {
  @Prop()
  name: string;
  @Prop()
  memo: string;
  @Prop()
  create_time?: number;
  @Prop()
  update_time?: number;
  @Prop({ type: [TrainItemSchema] })
  train_program: Array<TrainItem>;
}

const DefaultCardSchema = SchemaFactory.createForClass(DefaultCard);

@Schema()
export class User implements IUserAuth {
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
  @Prop()
  cur_active_plan_id: string;
  @Prop({ type: [DefaultCardSchema], default: [] })
  default_cards: ITrainCard[];

  async validatePassword(password: string): Promise<boolean> {
    return (await bcrypt.hash(password, this.salt)) === this.pass_word;
  }
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
